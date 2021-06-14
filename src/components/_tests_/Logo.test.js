import * as React from "react";
import Logo from "../Logo";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<Logo />);
    expect(tree).toMatchSnapshot();
});