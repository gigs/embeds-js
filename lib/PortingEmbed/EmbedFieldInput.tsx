type Props = React.HTMLAttributes<HTMLInputElement>

export function EmbedFieldInput(props: Props) {
  // TODO: customizable classNames
  return (
    <input
      className="GigsEmbeds GigsPortingEmbed GigsEmbeds-fieldInput"
      {...props}
    />
  )
}
