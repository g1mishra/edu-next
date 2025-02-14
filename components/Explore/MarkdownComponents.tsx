import { MarkdownComponentProps } from "@/types";

export const MarkdownComponents: Record<string, React.FC<MarkdownComponentProps>> = {
  h1: ({ children, ...props }) => (
    <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mt-4 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mt-3 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-base sm:text-lg font-medium text-gray-200 mt-2 mb-1" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-sm sm:text-base text-gray-300 my-1.5 leading-relaxed break-words" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside my-2 text-gray-300 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside my-2 text-gray-300 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="text-sm sm:text-base text-gray-300 ml-4" {...props}>
      {children}
    </li>
  ),
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote className="border-l-4 border-gray-500 pl-4 my-2 text-gray-400 italic" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, inline, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    return inline ? (
      <code className="bg-gray-700 px-1 rounded text-xs sm:text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <pre className="relative">
        {match && <div className="absolute right-2 top-2 text-xs text-gray-400">{match[1]}</div>}
        <code
          className={`block bg-gray-700 p-4 rounded-lg my-2 text-xs sm:text-sm 
            overflow-x-auto font-mono ${className || ""}`}
          {...props}
        >
          {children}
        </code>
      </pre>
    );
  },
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border-collapse text-sm text-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }) => (
    <th className="border border-gray-700 bg-gray-800 px-4 py-2 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="border border-gray-700 px-4 py-2" {...props}>
      {children}
    </td>
  ),
  hr: (props) => <hr className="my-4 border-gray-700" {...props} />,
  img: ({ src, alt, ...props }) => (
    <img
      src={src}
      alt={alt}
      className="max-w-full h-auto rounded-lg my-2"
      loading="lazy"
      {...props}
    />
  ),
};
