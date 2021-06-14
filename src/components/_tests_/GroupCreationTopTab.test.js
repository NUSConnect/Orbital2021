import * as React from "react";
import GroupCreationTopTab from "../GroupCreationTopTab";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<GroupCreationTopTab />);
    expect(tree).toMatchSnapshot();
});