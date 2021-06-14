import * as React from "react";
import CreateComment from "../CreateComment";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<CreateComment />);
    expect(tree).toMatchSnapshot();
});