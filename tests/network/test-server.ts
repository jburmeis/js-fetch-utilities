import { rest } from 'msw'
import { setupServer } from 'msw/node'

export const server = setupServer(

  // Routes that return static payloads

  rest.get('http://localhost:8080/static-text', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body("GET/reply"),
    )
  }),
  rest.put('http://localhost:8080/static-text', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body("PUT/reply"),
    )
  }),
  rest.post('http://localhost:8080/static-text', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body("POST/reply"),
    )
  }),
  rest.delete('http://localhost:8080/static-text', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body("DELETE/reply"),
    )
  }),
  rest.patch('http://localhost:8080/static-text', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.body("PATCH/reply"),
    )
  }),
  rest.get('http://localhost:8080/static-json', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        { message: "reply", value: 1 },
        { message: "reply", value: 2 },
      ]),
    )
  }),
  rest.get('http://localhost:8080/static-arraybuffer', (req, res, ctx) => {
    const buffer = new Uint8Array([255, 0, 128, 18]).buffer;
    return res(
      ctx.status(200),
      ctx.body(buffer),
    )
  }),
  rest.get('http://localhost:8080/static-blob', (req, res, ctx) => {
    const blob = new Blob([JSON.stringify({ message: "blob", value: 3 })], { type: "application/json" });
    return res(
      ctx.status(200),
      ctx.body(blob),
    )
  }),


  // Routes that return payloads based on the request

  rest.post('http://localhost:8080/return-post-json', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json(body),
    )
  }),
  rest.patch('http://localhost:8080/return-json-body-array-length', async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.body(body.length.toString()),
    )
  }),
  rest.post('http://localhost:8080/return-text-body-char-length', async (req, res, ctx) => {
    const body = await req.text();
    return res(
      ctx.status(200),
      ctx.body(body.length.toString()),
    )
  }),
  rest.post('http://localhost:8080/return-uint8-arraybuffer-as-json-array', async (req, res, ctx) => {
    const body = Array.from(new Uint8Array(await req.arrayBuffer()));
    return res(
      ctx.status(200),
      ctx.json(body),
    )
  }),
  rest.get('http://localhost:8080/return-query-params-as-json', (req, res, ctx) => {
    const params: Record<string, any> = {};
    for (const [key, value] of req.url.searchParams.entries()) {
      params[key] = value;
    }

    return res(
      ctx.status(200),
      ctx.json(params),
    )
  }),
  rest.get('http://localhost:8080/return-headers-as-json', (req, res, ctx) => {
    const params: Record<string, any> = {};
    for (const [key, value] of req.headers.entries()) {
      params[key] = value;
    }

    return res(
      ctx.status(200),
      ctx.json(params),
    )
  }),

  // Routes with error codes

  rest.get('http://localhost:8080/error-code-400', (req, res, ctx) => {
    return res(
      ctx.status(400),
      ctx.body("error message"),
    )
  }),
  rest.post('http://localhost:8080/accept-if-payload-is-ok', async (req, res, ctx) => {
    const body = await req.text();
    return res(
      ctx.status(body === "ok" ? 200 : 400),
    )
  }),
)
