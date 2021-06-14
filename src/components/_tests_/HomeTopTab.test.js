import * as React from "react";
import HomeTopTab from "../HomeTopTab";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<HomeTopTab />);
    expect(tree).toMatchSnapshot();
});