import * as React from "react";
import CommentItem from "../CommentItem";
import renderer from "react-test-renderer";
import moment from "moment";
import { fireEvent, render } from '@testing-library/react-native'

// Mock
jest.mock('firebase', ()  => {
    return {
        auth: jest.fn().mockReturnValue({ currentUser: { uid: 'tester' }}),
        firestore: jest.fn().mockReturnValue({
            collection: jest.fn().mockReturnValue({
                doc: jest.fn(() => {
                    return {
                        get: jest.fn(() => Promise.resolve(true))
                    }
                })
            })
        })
    }
})

class CustomDate {
    constructor(date) {
        this.date = date
    }
    toDate() {
        return this.date;
    }
}

const setDate = new Date(2021, 5, 15, 12, 0, 0)
const timestamp = new CustomDate(setDate)
const mockItem  = { userId: 12345, postTime: timestamp, commentBody: 'commentText' }

// Tests

it(`renders correctly`, async () => {
    const tree = renderer.create(<CommentItem item={mockItem} />);
    const instance = tree.root;
    expect(instance.findByProps({ testID: 'time' }).props.children).toEqual([" ·", " ", moment(timestamp.toDate()).fromNow()]);
    expect(instance.findByProps({ testID: 'comment' }).props.children).toEqual('commentText');
});

it(`on view profile`, () => {
    const mockFn = jest.fn(x => x);
    const {getByTestId} = render(<CommentItem item={mockItem} onViewProfile={mockFn} />);
    fireEvent.press(getByTestId('username'))
    expect(mockFn).toHaveBeenCalled();
});

it(`on press item`, () => {
    const mockFn = jest.fn();
    const {getByTestId} = render(<CommentItem item={mockItem} onPressHandle={mockFn} />);
    fireEvent.press(getByTestId('comment'))
    expect(mockFn).toHaveBeenCalled();
});