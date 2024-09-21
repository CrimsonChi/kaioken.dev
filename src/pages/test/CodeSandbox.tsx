import { JSXEditor } from "$/components/JSXEditor"
import { TabGroup } from "$/components/TabGroup"
import { useRef, useEffect, useState } from "kaioken"
import { NodeBoxProvider, useNodeBox, useWorkerStatus } from "./NodeBox"

interface CodeSanboxProps {
  files: Record<string, string>
}
const asyncNoop = async () => {}

export function CodeSandbox(props: CodeSanboxProps) {
  return (
    <NodeBoxProvider
      fallback={
        <small className="uppercase">preparing sandbox environment...</small>
      }
    >
      <CodeSandboxImpl {...props} />
      <small className="uppercase">
        <WorkerStatusDisplayText />
      </small>
    </NodeBoxProvider>
  )
}

function WorkerStatusDisplayText() {
  const status = useWorkerStatus()
  if (!status) return null
  switch (status.state) {
    case "command_running":
      return null
    case "starting_command":
    case "downloading_manifest":
      return status.state + "..."
    case "downloaded_module":
      return `downloaded module ${status.name}@${status.version}. total pending modules: ${status.totalPending}`
  }
}

function CodeSandboxImpl(props: CodeSanboxProps) {
  const nodeBox = useNodeBox()
  const killCmd = useRef<() => Promise<void>>(asyncNoop)
  const previewIframeRef = useRef<HTMLIFrameElement>(null)
  const [selectedFile, setSelectedFile] = useState(Object.keys(props.files)[0])

  useEffect(() => {
    killCmd.current = async () => {
      killCmd.current = asyncNoop
      try {
        await Promise.all(
          Object.keys(props.files).map(async (file) => {
            nodeBox.fs.rm(`/src/${file}`)
          })
        )
      } catch (error) {
        console.error("err", error)
      }
    }
    const init = async () => {
      if (!previewIframeRef.current) return
      const shell = nodeBox.shell.create()
      await nodeBox.fs.init({
        "package.json": JSON.stringify({
          name: "test",
          type: "module",
          scripts: {
            dev: "vite",
          },
          dependencies: {
            kaioken: "latest",
            "esbuild-wasm": "latest",
            "@rollup/wasm-node": "latest",
          },
          devDependencies: {
            typescript: "5.5.3",
            vite: "4.5.5",
            "vite-plugin-kaioken": "latest",
          },
          npm: {
            overrides: {
              rollup: "npm:@rollup/wasm-node",
            },
          },
        }),
        "/tsconfig.json": `
  {
    "compilerOptions": {
      "target": "ES2020",
      "useDefineForClassFields": true,
      "module": "ESNext",
      "lib": ["ES2020", "DOM", "DOM.Iterable"],
      "skipLibCheck": true,
  
      /* Bundler mode */
      "moduleResolution": "bundler",
      "allowImportingTsExtensions": true,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
  
      /* Linting */
      "strict": true,
      "noUnusedLocals": true,
      "noUnusedParameters": true,
      "noFallthroughCasesInSwitch": true,
  
      "jsx": "preserve"
    },
    "include": ["src"]
  }
  `,
        "startVite.js": `
  import { createServer } from 'vite';
  import kaioken from 'vite-plugin-kaioken';
  async function startViteServer() {
    try {
      // Create a Vite dev server
      const server = await createServer({
        // Optional: Define Vite-specific options here if needed
        // This is similar to the vite.config.js configuration
        server: {
          port: 3000,  // Customize the port if desired
        },
        
        plugins: [kaioken({devtools:false})],
      });
  
      // Start the server
      await server.listen();
        
      // Print out the URL to visit the app
      console.log(\`Vite server is running at: http://localhost:\${server.config.server.port}\`);
    } catch (err) {
      console.error('Error starting Vite server:', err);
    }
  }
  
  startViteServer();
  `,
        "/index.html": `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Vite + TS + Kaioken</title>
    </head>
    <body>
      <div id="app"></div>
      <script type="module" src="/src/main.ts"></script>
    </body>
  </html>
  `,
        "/src/main.ts": `
  import { mount } from "kaioken"
  import App from "./App"
  
  
  const root = document.getElementById("app")!
  mount(App, root)
            `,
      })
      if (!previewIframeRef.current) return
      await Promise.all(
        Object.keys(props.files).map(async (file) => {
          nodeBox.fs.writeFile(`/src/${file}`, props.files[file])
        })
      )
      if (!previewIframeRef.current) return
      await shell.runCommand("node", ["startVite.js"])
      try {
        if (!previewIframeRef.current) return
        const previewInfo = await nodeBox.preview.waitForPort(3000, 10_000)
        if (!previewIframeRef.current) return
        previewIframeRef.current.setAttribute("src", previewInfo.url)
      } catch (error) {
        console.error("err", error)
      }
    }
    init()
    return () => killCmd.current?.()
  }, [])

  const handleChange = (newCode: string) => {
    if (!nodeBox) return
    props.files[selectedFile] = newCode
    nodeBox.fs.writeFile(`/src/${selectedFile}`, newCode)
  }

  const code = props.files[selectedFile]

  return (
    <div className="mt-[var(--navbar-height)]">
      <TabGroup
        items={Object.keys(props.files)}
        value={selectedFile}
        onSelect={setSelectedFile}
      />
      <div className="flex gap-2">
        <JSXEditor
          key={selectedFile}
          content={code}
          onContentChanged={handleChange}
          className="flex-grow"
        />
        <iframe ref={previewIframeRef} className="flex-grow" />
      </div>
    </div>
  )
}
