import * as React from "react";
import CommentItem from "../CommentItem";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<CommentItem />);
    expect(tree).toMatchSnapshot();
});