/**
 * @jest-environment jsdom
 */

import "./matchMedia"
import {render, screen} from '@testing-library/react'
import React from "react";
import userEvent from '@testing-library/user-event';

import {App} from "../src/App";
import {use} from "msw/lib/core/utils/internal/requestHandlerUtils";
import {last_added_rule} from "./mocks/handlers";


it('main test', async () => {
    const component = render(
        <App/>
    );

    const trackerSelectors = await component.findAllByPlaceholderText("Select tracker");
    const boardSelectors = await component.findAllByPlaceholderText("Select board");
    const fieldSelectors = await component.findAllByPlaceholderText("Select field");

    expect(trackerSelectors.length).toBe(2);
    expect(boardSelectors.length).toBe(2);
    expect(fieldSelectors.length).toBe(2);
    for (let i = 0; i < 2; i++) {
        await userEvent.click(trackerSelectors[i]);
        const trackerOnes = await component.findAllByText(/Tracker: tracker one/i);
        expect(trackerOnes.length).toBe(2);
        await userEvent.click(trackerOnes[i]);

        await userEvent.click(boardSelectors[i]);
        const boardOnes = await component.findAllByText(/Board: board one/i);
        await userEvent.click(boardOnes[i]);

        await userEvent.click(fieldSelectors[i]);
        const fieldOnes = await component.findAllByText(/Field: field one/i);
        await userEvent.click(fieldOnes[i]);
    }

    const addRuleButton = await component.findByText("Add rule");

    await userEvent.click(addRuleButton);
    expect(last_added_rule).toBe("{\"source\":{\"tracker\":\"tracker one\",\"board\":\"board one\",\"fieldName\":\"field one\",\"fieldVal\":\"\",\"compOp\":\"=\"},\"destination\":{\"tracker\":\"tracker one\",\"board\":\"board one\",\"fieldName\":\"field one\",\"fieldVal\":\"\",\"compOp\":\"=\"},\"direction\":\"cmp\"}");

    component.findByText(/====aaaaa/i);
});