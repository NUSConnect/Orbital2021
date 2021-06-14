import * as React from "react";
import BackButton from "../BackButton";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<BackButton />);
    expect(tree).toMatchSnapshot();
});
