import React, {useEffect, useState} from "react";
import {FieldSelector} from "./FieldSelector";
import {Button, Container, Grid, GridCol, MantineProvider, rem, Table} from "@mantine/core";
import {IconArrowLeft, IconArrowRight, IconArrowsDiff} from "@tabler/icons-react";
import {FieldFilter} from "./FieldFilter";
import "./App.css";
import axios from "axios";
import {SyncRule, SyncDirection} from "./SyncRule";
import {RuleListViewer} from "./RuleListViewer";

const middleIconSize = 32;

const DefaultFilter: FieldFilter = {project: "", board: "", fieldName: "", fieldVal: "", compOp: "="};

export function App() {
    const [sourceFilter, setSourceFilter] = useState<FieldFilter>(DefaultFilter);
    const [destinationFilter, setDestinationFilter] = useState<FieldFilter>(DefaultFilter);
    const [direction, setDirection] = useState<SyncDirection>("cmp");
    const [ruleList, setRuleList] = useState<SyncRule[]>([]);
    const refreshRuleList = () => {
        axios.get("/api/rule_list", {
            params: {
                sourceProject: sourceFilter.project,
                sourceBoard: sourceFilter.board,
                destinationProject: destinationFilter.project,
                destinationBoard: destinationFilter.board
            }
        }).then(resp => {
            setRuleList(resp.data);
        }).catch(err => {
            console.error("could not get rule list", err);
            setRuleList([{
                source: {project: "aaa", board: "bbb", fieldName: "ccc", fieldVal: "ddd", compOp: "="},
                destination: {project: "eee", board: "fff", fieldName: "ggg", fieldVal: "hhh", compOp: "="},
                direction: "cmp"
            }, {
                source: {project: "aaa", board: "bbb", fieldName: "ccc", fieldVal: "ddd", compOp: "="},
                destination: {project: "eee", board: "fff", fieldName: "ggg", fieldVal: "hhh", compOp: "="},
                direction: "std"
            }, {
                source: {project: "aaa", board: "bbb", fieldName: "ccc", fieldVal: "ddd", compOp: "="},
                destination: {project: "eee", board: "fff", fieldName: "ggg", fieldVal: "hhh", compOp: "="},
                direction: "dts"
            }])
        });
    };
    const addButtonHandler = () => {
        axios.post("/api/add_rule", {
            source: sourceFilter,
            destination: destinationFilter,
            direction: direction
        }).then(() => {
            refreshRuleList();
        }).catch(err => {
            console.error("could not add new rule", err)
        });
    };

    useEffect(() => {
        refreshRuleList();
    }, []);
    return <MantineProvider>
        <Container>
            <Grid>
                <GridCol span="auto">
                    <FieldSelector value={sourceFilter} setValue={setSourceFilter} isDestination={direction === "dts"}/>
                </GridCol>
                <GridCol span="content">
                    <div className={direction == "dts" ? "selectedArrow arrow" : "arrow"} onClick={() => {
                        setDirection("dts");
                    }}><IconArrowLeft size={rem(middleIconSize)}/></div>
                    <div className={direction == "cmp" ? "selectedArrow arrow" : "arrow"} onClick={() => {
                        setDirection("cmp");
                    }}><IconArrowsDiff size={rem(middleIconSize)}/></div>
                    <div className={direction == "std" ? "selectedArrow arrow" : "arrow"} onClick={() => {
                        setDirection("std");
                    }}><IconArrowRight size={rem(middleIconSize)}/></div>
                </GridCol>
                <GridCol span="auto">
                    <FieldSelector value={destinationFilter} setValue={setDestinationFilter}
                                   isDestination={direction === "std"}/>
                </GridCol>
            </Grid>
            <Button color="red" my="auto" onClick={addButtonHandler}>Add rule</Button>
            <br/>
            <RuleListViewer ruleList={ruleList} refreshRuleList={refreshRuleList}/>
        </Container>
    </MantineProvider>;
}