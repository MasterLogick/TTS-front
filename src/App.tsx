import React, {useEffect, useState} from "react";
import {FieldSelector} from "./FieldSelector";
import {Button, Container, Flex, Grid, GridCol, MantineProvider, rem, Table} from "@mantine/core";
import {IconArrowLeft, IconArrowRight, IconArrowsDiff} from "@tabler/icons-react";
import {FieldFilter} from "./FieldFilter";
import * as classes from "./App.module.css";
import axios from "axios";
import {SyncRule, SyncDirection} from "./SyncRule";
import {RuleListViewer} from "./RuleListViewer";
import clsx from "clsx";

const middleIconSize = 38;

export function App() {
    const [sourceFilter, setSourceFilter] = useState<FieldFilter>(FieldFilter.DefaultFilter);
    const [destinationFilter, setDestinationFilter] = useState<FieldFilter>(FieldFilter.DefaultFilter);
    const [direction, setDirection] = useState<SyncDirection>("cmp");
    const [ruleList, setRuleList] = useState<SyncRule[]>([]);
    const refreshRuleList = () => {
        if (sourceFilter.tracker === "" ||
            sourceFilter.board === "" ||
            destinationFilter.tracker === "" ||
            destinationFilter.board === "") {
            return;
        }
        axios.get("/api/rule_list", {
            params: {
                sourceProject: sourceFilter.tracker,
                sourceBoard: sourceFilter.board,
                destinationProject: destinationFilter.tracker,
                destinationBoard: destinationFilter.board
            }
        }).then(resp => {
            setRuleList(resp.data);
        }).catch(err => {
            console.error("could not get rule list", err);
            setRuleList([{
                source: {tracker: "aaa", board: "bbb", fieldName: "ccc", fieldVal: "ddd", compOp: "="},
                destination: {tracker: "eee", board: "fff", fieldName: "ggg", fieldVal: "hhh", compOp: "="},
                direction: "cmp"
            }, {
                source: {tracker: "aaa", board: "bbb", fieldName: "ccc", fieldVal: "ddd", compOp: "="},
                destination: {tracker: "eee", board: "fff", fieldName: "ggg", fieldVal: "hhh", compOp: "="},
                direction: "std"
            }, {
                source: {tracker: "aaa", board: "bbb", fieldName: "ccc", fieldVal: "ddd", compOp: "="},
                destination: {tracker: "eee", board: "fff", fieldName: "ggg", fieldVal: "hhh", compOp: "="},
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
            <Flex direction={{base: 'column', sm: 'row'}} justify={{sm: 'center'}}>
                <h1>Task Tracker Syncronizer</h1>
            </Flex>
            <h3>New Rule</h3>
            <Grid mb={rem(5)}>
                <GridCol span="auto">
                    <FieldSelector value={sourceFilter} setValue={setSourceFilter}
                                   isDestination={direction === "dts"} isComparing={direction === "cmp"}/>
                </GridCol>
                <GridCol span="content" style={{alignSelf: "end"}}>
                    <Flex direction={{base: 'column', sm: 'row'}} justify={{sm: 'center'}}>
                        <IconArrowLeft className={clsx({[classes.selectedArrow]: direction == "dts"}, classes.arrow)}
                                       size={rem(middleIconSize)} onClick={() => {
                            setDirection("dts");
                        }}/>
                        <IconArrowsDiff className={clsx(classes.arrow, {[classes.selectedArrow]: direction == "cmp"})}
                                        size={rem(middleIconSize)} onClick={() => {
                            setDirection("cmp");
                        }}/>
                        <IconArrowRight className={clsx({[classes.selectedArrow]: direction == "std"}, classes.arrow)}
                                        size={rem(middleIconSize)} onClick={() => {
                            setDirection("std");
                        }}/>
                    </Flex>
                </GridCol>
                <GridCol span="auto">
                    <FieldSelector value={destinationFilter} setValue={setDestinationFilter}
                                   isDestination={direction === "std"} isComparing={direction === "cmp"}/>
                </GridCol>
            </Grid>
            <Flex direction={{base: 'column', sm: 'row'}} justify={{sm: 'center'}}>
                <Button color="green" my={rem(3)} onClick={addButtonHandler}>Add rule</Button>
            </Flex>
            <br/>
            <br/>
            <h3>Sync rules</h3>
            <RuleListViewer ruleList={ruleList} refreshRuleList={refreshRuleList}/>
        </Container>
    </MantineProvider>;
}