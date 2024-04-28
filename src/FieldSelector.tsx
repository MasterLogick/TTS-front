import React, {useEffect, useState} from "react";
import {Container, rem, Select, TextInput} from "@mantine/core";
import axios from "axios";
import {FieldFilter, FilterOps, FilterOpType} from "./FieldFilter";

export function FieldSelector({value, setValue, isDestination}: {
    value: FieldFilter,
    setValue: (v: FieldFilter) => void,
    isDestination: boolean
}) {
    const [projects, setProjects] = useState<string[]>([]);
    const [boards, setBoards] = useState<string[]>([]);
    const [fields, setFields] = useState<string[]>([]);
    useEffect(() => {
        axios.get("/api/projects").then(resp => {
            setProjects(resp.data);
        }).catch(err => {
            setProjects(["first project", "second project"]);
        });
    }, []);
    useEffect(() => {
        if (value.project === "")
            return;
        axios.get("/api/boards", {params: {project: value.project}}).then(resp => {
            setBoards(resp.data);
        }).catch(err => {
            setBoards(["first board", "second board"]);
        });
    }, [value.project]);
    useEffect(() => {
        if (value.board === "" || value.project === "")
            return;
        axios.get("/api/fields", {params: {project: value.project, board: value.board}}).then(resp => {
            setFields(resp.data);
        }).catch(err => {
            setFields(["first field", "second field"]);
        });
    }, [value.board]);
    return <Container m={rem(2)}>
        <Select
            label="Select project"
            data={projects}
            onChange={project => {
                setValue({...value, project: project});
            }}
            value={value.project}
        />
        <Select
            label="Select board"
            data={boards}
            onChange={board => {
                setValue({...value, board: board});
            }}
            value={value.board}
            disabled={value.project === ""}
        />
        <Select
            label="Select field"
            data={fields}
            onChange={field => {
                setValue({...value, fieldName: field})
            }}
            value={value.fieldName}
            disabled={value.board === ""}
        />
        <TextInput
            label="Field value"
            onChange={val => {
                setValue({...value, fieldVal: val.currentTarget.value});
            }}
            value={value.fieldVal}
        />
        <Select
            label="Select condition"
            data={FilterOps}
            onChange={op => {
                setValue({...value, compOp: op as FilterOpType});
            }}
            value={value.compOp}
            disabled={isDestination}
        />
    </Container>;
}