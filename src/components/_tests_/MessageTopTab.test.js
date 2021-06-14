import * as React from "react";
import MessageTopTab from "../MessageTopTab";
import renderer from "react-test-renderer";
import { fireEvent, render } from '@testing-library/react-native';

it(`renders correctly`, () => {
    const tree = renderer.create(<MessageTopTab />);
    expect(tree).toMatchSnapshot();
});
/* not working, unsure why
it(`on press button`, () => {
    const mockOnPressFn = jest.fn();
    const {getByTestId} = render(<MessageTopTab onPress={mockOnPressFn} />);
    fireEvent.press(getByTestId('onBack'));
    expect(mockOnPressFn).toHaveBeenCalled();
});
*/
it(`on press button`, () => {
    const mockOnPressFn = jest.fn();
    const {getByTestId} = render(<MessageTopTab onPress={mockOnPressFn} />);
    fireEvent.press(getByTestId('onPress'));
    expect(mockOnPressFn).toHaveBeenCalled();
});