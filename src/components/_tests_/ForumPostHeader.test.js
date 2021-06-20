import * as React from "react";
import ForumPostHeader from "../ForumPostHeader";
import renderer from "react-test-renderer";
import { fireEvent, render } from '@testing-library/react-native';

it(`renders correctly`, () => {
    const tree = renderer.create(<ForumPostHeader />);
    expect(tree).toMatchSnapshot();
});

it(`on press button`, () => {
    const mockGoBackFn = jest.fn();
    const {getByTestId} = render(<ForumPostHeader goBack={mockGoBackFn} />);
    fireEvent.press(getByTestId('back'))
    expect(mockGoBackFn).toHaveBeenCalled();
});