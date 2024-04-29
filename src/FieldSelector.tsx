import React, {useEffect, useState} from "react";
import {Container, rem, Select, TextInput} from "@mantine/core";
import axios from "axios";
import {FieldFilter, FilterOps, FilterOpType} from "./FieldFilter";

const OpSelectWidth = 70;

export function FieldSelector({value, setValue, isDestination, isComparing}: {
    value: FieldFilter,
    setValue: (v: FieldFilter) => void,
    isDestination: boolean,
    isComparing: boolean
}) {
    const [trackers, setTrackers] = useState<string[]>([]);
    const [boards, setBoards] = useState<string[]>([]);
    const [fields, setFields] = useState<string[]>([]);
    useEffect(() => {
        axios.get("/api/trackers").then(resp => {
            setTrackers(resp.data);
        }).catch(err => {
            setTrackers(["first tracker", "second tracker"]);
        });
    }, []);
    useEffect(() => {
        if (value.tracker === "")
            return;
        axios.get("/api/boards", {params: {project: value.tracker}}).then(resp => {
            setBoards(resp.data);
        }).catch(err => {
            setBoards(["first board", "second board"]);
        });
    }, [value.tracker]);
    useEffect(() => {
        if (value.board === "" || value.tracker === "")
            return;
        axios.get("/api/fields", {params: {project: value.tracker, board: value.board}}).then(resp => {
            setFields(resp.data);
        }).catch(err => {
            setFields(["first field", "second field"]);
        });
    }, [value.board]);
    return <Container>
        <Select
            my={rem(10)}
            allowDeselect={false}
            checkIconPosition="right"
            placeholder="Select tracker"
            data={trackers}
            onChange={tracker => {
                if (value.tracker !== tracker) {
                    setValue({...FieldFilter.DefaultFilter, tracker: tracker});
                }
            }}
            renderOption={({option, checked}) => <>Tracker: {option.value}</>}
            value={value.tracker}
        />
        <Select
            my={rem(10)}
            checkIconPosition="right"
            placeholder="Select board"
            data={boards}
            onChange={board => {
                if (value.board !== board) {
                    setValue({...FieldFilter.DefaultFilter, tracker: value.tracker, board: board});
                }
            }}
            value={value.board}
            renderOption={({option, checked}) => <>Board: {option.value}</>}
            disabled={value.tracker === ""}
        />
        <Select
            my={rem(10)}
            allowDeselect={false}
            checkIconPosition="right"
            placeholder="Select field"
            data={fields}
            onChange={field => {
                setValue({...value, fieldName: field})
            }}
            value={value.fieldName}
            renderOption={({option, checked}) => <>Field: {option.value}</>}
            disabled={value.board === ""}
        />
        <TextInput
            my={rem(10)}
            placeholder="Field value"
            onChange={val => {
                setValue({...value, fieldVal: val.currentTarget.value});
            }}
            value={value.fieldVal}
            leftSection={<Select
                allowDeselect={false}
                checkIconPosition="right"
                data={FilterOps}
                onChange={op => {
                    setValue({...value, compOp: op as FilterOpType});
                }}
                value={value.compOp}
                disabled={isDestination || isComparing}
                styles={{
                    input: {
                        fontWeight: 900,
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                        width: rem(OpSelectWidth),
                        marginLeft: rem(-2),
                        textAlign: "end",
                        paddingInlineEnd: "calc(var(--input-padding-inline-end)*0.5)"
                    }
                }}
            />}
            styles={{
                input: {
                    paddingInlineStart: "calc(var(--input-padding-inline-start) + " + rem(5) + ")"
                }
            }}
            leftSectionWidth={OpSelectWidth}
            disabled={isComparing}
        />
    </Container>;
}