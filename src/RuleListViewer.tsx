import React from "react";
import {SyncRule} from "./SyncRule";
import {rem, Table} from "@mantine/core";
import {IconArrowLeft, IconArrowRight, IconArrowsDiff, IconArrowsLeft, IconX} from "@tabler/icons-react";
import axios from "axios";
import clsx from "clsx";
import * as classes from "./RuleListViewer.module.css"

const TableArrowSize = 32;

export function RuleListViewer({ruleList, refreshRuleList}: {
    ruleList: SyncRule[],
    refreshRuleList: () => void
}) {
    return <>
        <Table withRowBorders={false}>
            <Table.Thead>
                <Table.Tr>
                    <Table.Td>Field</Table.Td>
                    <Table.Td></Table.Td>
                    <Table.Td>Value</Table.Td>
                    <Table.Td></Table.Td>
                    <Table.Td>Field</Table.Td>
                    <Table.Td></Table.Td>
                    <Table.Td>Value</Table.Td>
                    <Table.Td></Table.Td>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {ruleList.map((rule, index) => <Table.Tr key={index}>
                    <Table.Td><p className={clsx(classes.badge, classes.blue)}>{rule.source.fieldName}</p></Table.Td>
                    <Table.Td><p style={{textAlign: "center"}}>{rule.source.compOp}</p></Table.Td>
                    <Table.Td><p className={clsx(classes.badge, classes.red)}>{rule.source.fieldVal}</p></Table.Td>
                    <Table.Td><p style={{textAlign: "center"}}>{(() => {
                        switch (rule.direction) {
                            case "std":
                                return <IconArrowRight size={rem(TableArrowSize)}/>
                            case "dts":
                                return <IconArrowLeft size={rem(TableArrowSize)}/>
                            case "cmp":
                                return <IconArrowsDiff size={rem(TableArrowSize)}/>
                        }
                    })()}</p></Table.Td>
                    <Table.Td><p className={clsx(classes.badge, classes.blue)}>{rule.destination.fieldName}</p>
                    </Table.Td>
                    <Table.Td><p style={{textAlign: "center"}}>{rule.destination.compOp}</p></Table.Td>
                    <Table.Td><p className={clsx(classes.badge, classes.red)}>{rule.destination.fieldVal}</p></Table.Td>
                    <Table.Td>
                        <div onClick={() => {
                            axios.delete("/api/remove_rule", {params: rule}).then(refreshRuleList).catch(err => {
                                console.error("could not remove rule", err);
                            })
                        }}><IconX/></div>
                    </Table.Td>
                </Table.Tr>)}
            </Table.Tbody>
        </Table></>;
}