import * as React from "react";
import ForumIcon from "../ForumIcon";
import renderer from "react-test-renderer";
import { fireEvent, render } from '@testing-library/react-native'

const mockItem = { forumName: 'TestName', forumImg: 'MockForumImg' }

it(`renders correctly`, () => {
    const tree = renderer.create(<ForumIcon item={mockItem}/>);
    expect(tree).toMatchSnapshot();
    const instance = tree.root
    expect(instance.findByProps({ testID: 'text' }).props.children).toEqual('TestName');
    expect(instance.findByProps({ testID: 'image' }).props.source.uri).toEqual('MockForumImg');
});

it(`on press button`, () => {
    const mockGoBackFn = jest.fn();
    const {getByTestId} = render(<ForumIcon item={mockItem} onPress={mockGoBackFn} />);
    fireEvent.press(getByTestId('icon'))
    expect(mockGoBackFn).toHaveBeenCalled();
});