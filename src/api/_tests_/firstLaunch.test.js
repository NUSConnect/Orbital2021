import { AsyncStorage } from "react-native";
import checkIfFirstLaunch from "../firstLaunch";

it("can read asyncstorage", async () => {
    this.HAS_LAUNCHED = "";
    await AsyncStorage.getItem('HAS_LAUNCHED').then(HAS_LAUNCHED => {
        this.HAS_LAUNCHED = HAS_LAUNCHED;
    });
    expect(this.HAS_LAUNCHED).toBe(null);
});

it("checkIfFirstLaunch returns true", async () => {
    const func = await checkIfFirstLaunch();
    expect(func).toBe(true);
});