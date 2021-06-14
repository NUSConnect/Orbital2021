import * as React from "react";
import TitleWithBack from "../TitleWithBack";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<TitleWithBack />);
    expect(tree).toMatchSnapshot();
});