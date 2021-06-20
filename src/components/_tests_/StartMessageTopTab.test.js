import * as React from "react";
import StartMessageTopTab from "../StartMessageTopTab";
import renderer from "react-test-renderer";

it(`renders correctly`, () => {
    const tree = renderer.create(<StartMessageTopTab />);
    expect(tree).toMatchSnapshot();
});