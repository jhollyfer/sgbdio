---
id: default-query-function
title: Default Query Function
---

Se por algum motivo você quiser compartilhar a mesma função de query para toda a sua aplicação e usar apenas as query keys para identificar o que deve ser buscado, você pode fazer isso fornecendo uma **função de query padrão** ao TanStack Query:

[//]: # "Example"

```tsx
// Define a default query function that will receive the query key
const defaultQueryFn = async ({ queryKey }) => {
  const { data } = await axios.get(
    `https://jsonplaceholder.typicode.com${queryKey[0]}`,
  );
  return data;
};

// provide the default query function to your app with defaultOptions
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}

// All you have to do now is pass a key!
function Posts() {
  const { status, data, error, isFetching } = useQuery({
    queryKey: ["/posts"],
  });

  // ...
}

// You can even leave out the queryFn and just go straight into options
function Post({ postId }) {
  const { status, data, error, isFetching } = useQuery({
    queryKey: [`/posts/${postId}`],
    enabled: !!postId,
  });

  // ...
}
```

[//]: # "Example"

Se você quiser sobrescrever a queryFn padrão em algum momento, basta fornecer a sua própria como faria normalmente.
