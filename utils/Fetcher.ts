interface Request  {
    url: string;
    headers?: Headers;
    body?: any;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
}

export const GET = async ({url, headers}:Request) => {
    const res = await fetch(url, {
        method: 'GET',
        headers: headers,
    });
    return res.json();
}

export const POST = async ({url, headers, body}:Request) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
    });
    return res.json();
}

export const PUT = async ({url, headers, body}:Request) => {
    const res = await fetch(url, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body),
    });
    return res.json();
}

export const DELETE = async ({url, headers}:Request) => {
    const res = await fetch(url, {
        method: 'DELETE',
        headers: headers
    });
    return res.json();
}
