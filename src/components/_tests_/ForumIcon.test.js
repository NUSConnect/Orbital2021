import * as React from "react";
import ForumIcon from "../ForumIcon";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<ForumIcon />);
    expect(tree).toMatchSnapshot();
});