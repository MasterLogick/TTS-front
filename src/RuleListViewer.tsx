import React from "react";
import {SyncRule} from "./SyncRule";
import {Combobox, rem, Table} from "@mantine/core";
import {IconArrowLeft, IconArrowRight, IconArrowsDiff, IconArrowsLeft, IconX} from "@tabler/icons-react";
import Header = Combobox.Header;
import axios from "axios";

const TableArrowSize = 16;

export function RuleListViewer({ruleList, refreshRuleList}: { ruleList: SyncRule[], refreshRuleList: () => void }) {
    return <Table>
        <Table.Thead>
            <Table.Tr>
                <Table.Td>Source field name</Table.Td>
                <Table.Td>Source field value</Table.Td>
                <Table.Td>Sync orientation</Table.Td>
                <Table.Td>Destination field name</Table.Td>
                <Table.Td>Destination field value</Table.Td>
                <Table.Td></Table.Td>
            </Table.Tr>
        </Table.Thead>
        {ruleList.map((rule, index) => <Table.Tr key={index}>
            <Table.Td>{rule.source.fieldName}</Table.Td>
            <Table.Td>{rule.source.fieldVal}</Table.Td>
            <Table.Td>{(() => {
                switch (rule.direction) {
                    case "std":
                        return <IconArrowRight size={rem(TableArrowSize)}/>
                    case "dts":
                        return <IconArrowsLeft size={rem(TableArrowSize)}/>
                    case "cmp":
                        return <IconArrowsDiff size={rem(TableArrowSize)}/>
                }
            })()}</Table.Td>
            <Table.Td>{rule.destination.fieldName}</Table.Td>
            <Table.Td>{rule.destination.fieldVal}</Table.Td>
            <Table.Td>
                <div onClick={() => {
                    axios.delete("/api/remove_rule", {params: rule}).then(refreshRuleList).catch(err => {
                        console.error("could not remove rule", err);
                    })
                }}><IconX/></div>
            </Table.Td>
        </Table.Tr>)}
    </Table>;
}