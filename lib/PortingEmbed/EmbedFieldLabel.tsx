type Props = React.HTMLAttributes<HTMLLabelElement>

export function EmbedFieldLabel(props: Props) {
  // TODO: customizable classNames
  return (
    <label
      className="GigsEmbeds GigsPortingEmbed GigsEmbeds-fieldLabel"
      {...props}
    />
  )
}
