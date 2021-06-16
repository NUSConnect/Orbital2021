import * as authentication from "../auth";
import * as firebase from "firebase";

jest.mock("firebase", () => {
            return {
                auth: jest.fn(() => {
                    return {
                        createUserWithEmailAndPassword: jest.fn(
                            (email, password) => {
                                return new Promise(function (resolve, reject) {
                                    resolve({
                                        email: "test@test.com",
                                        uid: "12345abcde",
                                    });

                                    reject({ message: "error!" });
                                });
                            }
                        ),
                        signOut: jest.fn(() => {
                            return new Promise(function (resolve, reject) {
                                resolve("Success");
                                reject({ message: "error!" });
                            });
                        }),
                        onAuthStateChanged: jest.fn(() => {
                            return {
                                email: "test@test.com",
                                uid: "12345abcde",
                            };
                        }),
                        signInWithEmailAndPassword: jest.fn(
                            (email, password) => {
                                return new Promise(function (resolve, reject) {
                                    reject({ message: "error!" });
                                });
                            }
                        ),
                    };
                })
            }
});

it("calls sign out successfully", async () => {
    await authentication.logoutUser();
    expect(signOut).toHaveBeenCalled();
});

