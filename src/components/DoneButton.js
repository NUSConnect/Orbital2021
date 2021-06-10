import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function Done({ ...props }) {
    return (
        <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
            <Text style={{ fontSize: 16 }}>Done</Text>
        </TouchableOpacity>
    );
}
