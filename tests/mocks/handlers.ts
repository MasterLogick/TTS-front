import {http, graphql, HttpResponse} from 'msw'

export var last_added_rule = "";

export const handlers = [
    http.get('/api/trackers', () => {
        return HttpResponse.json(["tracker one", "tracker two"]);
    }),
    http.get("/api/boards", () => {
        return HttpResponse.json(["board one", "board two"]);
    }),
    http.get("/api/fields", () => {
        return HttpResponse.json(["field one", "field two"]);
    }),
    http.post("/api/add_rule", (args) => {
        args.request.text().then(e => {
            last_added_rule = e
        });
        return HttpResponse.text();
    }),
    http.get("/api/rule_list", () => {
        return HttpResponse.json([{"source":{"tracker":"====aaaaa","board":"board one","fieldName":"field one","fieldVal":"","compOp":"="},"destination":{"tracker":"tracker one","board":"board one","fieldName":"field one","fieldVal":"","compOp":"="},"direction":"cmp"}]);
    })
]