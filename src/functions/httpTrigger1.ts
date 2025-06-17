import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const id = request.params.id;
    return { body: `ID: ${id}` };
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: 'workitem/generate/{id:int?}',
    handler: httpTrigger1
});


// import { app, HttpRequest, HttpResponseInit, Invoc  ationContext } from "@azure/functions";

// export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
//     context.log(`Http function processed request for url "${request.url}"`);
//     const name = request.query.get('name') || await request.text() || 'world';
//     return { body: `Hello, ${name}!` };
// };

// app.http('httpTrigger1', {
//     methods: ['GET', 'POST'],
//     authLevel: 'anonymous',
//     handler: httpTrigger1
// });
