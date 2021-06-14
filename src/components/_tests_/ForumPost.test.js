import * as React from "react";
import ForumPost from "../ForumPost";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<ForumPost />);
    expect(tree).toMatchSnapshot();
});