import React from "react";
import { Text, TouchableOpacity } from "react-native";

export default function SkipButton({ ...props }) {
    return (
        <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
            <Text style={{ fontSize: 16 }}>Skip</Text>
        </TouchableOpacity>
    );
}