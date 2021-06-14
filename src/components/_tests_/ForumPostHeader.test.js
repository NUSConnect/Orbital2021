import * as React from "react";
import ForumPostHeader from "../ForumPostHeader";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<ForumPostHeader />);
    expect(tree).toMatchSnapshot();
});