import * as React from "react";
import MessageTopTab from "../MessageTopTab";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<MessageTopTab />);
    expect(tree).toMatchSnapshot();
});