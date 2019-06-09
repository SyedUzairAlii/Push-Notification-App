import actionTypes from '../Constant/Constant'
import firebase from '../../config/Firebase'

var db = firebase.database()


export function userAuth() {
    return dispatch => {

        return new Promise(function (resolve, reject) {
            firebase.auth().onAuthStateChanged((user) => {
                if (user) {
                    var arr = [];
                    var uid = user.uid;
                    // dispatch({ type: actionTypes.LOADER, payload: true })

                    db.ref('user').on('child_added', (snapShot) => {
                        if (snapShot.val().userUid === uid) {
                            dispatch({ type: actionTypes.USER, payload: snapShot.val() })
                        }
                    })

                    db.ref('user').on('child_changed', (snapShot) => {
                        if (snapShot.val().userUid === uid) {
                            dispatch({ type: actionTypes.USER, payload: snapShot.val() })
                        }
                    })
                    resolve()
                }
                else {
                    reject()
                    // dispatch({ type: actionTypes.AUTHCHANGE, payload: 'logout' })
                    // dispatch({ type: actionTypes.ROLE, payload: 'user' })
                }
            });
        })
    }
}



export function Action(Email, Password) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            firebase.auth().signInWithEmailAndPassword(Email, Password)
                .then((success) => {
                    console.log(success);
                    resolve()
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
}


export function UserSignUp(obj) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            const email = obj.email
            const password = obj.password
            firebase.auth().createUserWithEmailAndPassword(email, password).then((user) => {
                let data = {
                    email,
                    FirstName: obj.FirstName,
                    LastName: obj.LastName,
                    userUid: user.user.uid,
                    address: obj.address,
                    status: obj.status
                }

                db.ref('/user').push(data)
                resolve()
                var UserUID = user.user.uid
                dispatch({ type: ActionTypes.UID, payload: UserUID })

            })
                .catch((err) => {
                    // console.log(err)
                    reject(err)
                })
        })
    }
}


export function UpdateUserProfile(items, userUid) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            db.ref('user').on('child_added', (snapShot) => {
                db.ref('user/' + snapShot.key).update({
                    mobile: items.number,
                    handicapParkingCard: items.disabledPark,
                })
            })

            db.ref('vehicle').on('child_added', (snapShot) => {
                db.ref('vehicle/' + snapShot.key).update({
                    reg: items.register,
                    type: items.radio,
                })
            })
        })
    }
}


// export function AddParkingSpace(data, user) {
//     return dispatch => {
//         return new Promise(function (resolve, reject) {
//             db.ref('places/' + user).set(data).then(() => {
//                 resolve()
//             }).catch(() => {
//                 reject()
//             })
//         })
//     }
// }


// export function GetParkingSpace(user) {
//     return dispatch => {
//         return new Promise(function (resolve, reject) {
//             db.ref('/places/').orderByChild('userUid').equalTo(user).on('child_added', (snapShot) => {
//                 dispatch({ type: actionTypes.PARKINGSPACE, payload: snapShot.val() })
//             })

//             db.ref('/places/').orderByChild('userUid').equalTo(user).on('child_changed', (snapShot) => {
//                 dispatch({ type: actionTypes.PARKINGSPACE, payload: snapShot.val() })
//             })
//         })
//     }
// }


export function ForgetPasswordAction(email) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            // console.log('Email Address', email)
            var auth = firebase.auth();

            auth.sendPasswordResetEmail(email)
                .then((success) => {
                    resolve()
                    // Email sent.
                    // console.log('success***', success)

                })
                .catch((error) => {
                    // An error happened.
                    reject(error)

                })
        })
    }
}


export function IncreaseParking(vehicle, id) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            db.ref('places/' + id + '/parking/').once('value', (snapShot) => {
                if (snapShot.val()[vehicle.type] != 0) {
                    const number = Number(snapShot.val()[vehicle.type]) - 1
                    db.ref('places/' + id + '/parking/').update({
                        [vehicle.type]: (number).toString(),
                    }).then(() => {
                        db.ref('vehicle/').orderByChild('userUid').equalTo(vehicle.userUid).once('child_added', (snaps) => {
                            db.ref('vehicle/' + snaps.key + '/').update({
                                parkUserUID: id
                            })
                        })
                        resolve()
                    })
                        .catch((err) => {
                            console.log(err, 'err')
                        })
                } else {
                    reject()
                }
            })
        })
    }
}


export function DecreaseParking(vehicle, id) {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            db.ref('places/' + id + '/parking/').once('value', (snapShot) => {

                const number = Number(snapShot.val()[vehicle.type]) + 1
                db.ref('places/' + id + '/parking/').update({
                    [vehicle.type]: (number).toString(),
                }).then(() => {
                    db.ref('vehicle/').orderByChild('userUid').equalTo(vehicle.userUid).once('child_added', (snaps) => {
                        db.ref('vehicle/' + snaps.key + '/').update({
                            parkUserUID: ''
                        })
                    })
                    resolve()
                })
                    .catch((err) => {
                        console.log(err, 'err')
                    })

            })
        })
    }
}



//LOgOut

export function Log_Out() {
    return dispatch => {
        return new Promise(function (resolve, reject) {
            firebase.auth().signOut()
                .then((success) => {
                    console.log(success);
                    resolve()
                })
                .catch((error) => {
                    reject()
                })
        })
    }
}