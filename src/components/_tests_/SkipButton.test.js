import * as React from "react";
import SkipButton from "../SkipButton";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<SkipButton />);
    expect(tree).toMatchSnapshot();
});
