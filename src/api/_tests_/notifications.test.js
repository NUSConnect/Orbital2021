import { sendPushNotification } from "../notifications";

it("sendPushNotification fetches once", () => {
    const mockToken = "testToken";
    const mockSender = "testSender";
    const mockMessage = "testMessage";
    fetch = jest.fn(() => Promise.resolve());
    sendPushNotification(mockToken, mockSender, mockMessage);
    expect(fetch).toHaveBeenCalledTimes(1);
});

it("sendPushNotification fetches the correct items", () => {
    const mockToken = "testToken";
    const mockSender = "testSender";
    const mockMessage = "testMessage";
    fetch = jest.fn(() => Promise.resolve());
    sendPushNotification(mockToken, mockSender, mockMessage);
    expect(
        fetch(sendPushNotification(mockToken, mockSender, mockMessage))
    ).resolves.toBe({
        to: "testToken",
        sound: "default",
        title: "Portal.io: " + "testSender",
        body: "testMessage",
    });
});