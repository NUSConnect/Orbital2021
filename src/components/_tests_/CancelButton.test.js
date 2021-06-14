import * as React from "react";
import CancelButton from "../CancelButton";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<CancelButton />);
    expect(tree).toMatchSnapshot();
});