import { Text as TextPdf } from '@react-pdf/renderer'

const Text = (props: any) => {
  const {
    children,
    fontSize = '8px',
    textAlign = '',
    border,
    borderContent,
    minWidth,
    maxWidth,
    padding = '4px 3px',
    color = '#1a1a1a',
    bold,
    style,
  } = props

  const borderStyle = {
    borderTop: border?.top || borderContent ? '1px solid black' : '',
    borderRight: border?.right || borderContent ? '1px solid black' : '',
    borderBottom: border?.bottom || borderContent ? '1px solid black' : '',
    borderLeft: border?.left || borderContent ? '1px solid black' : '',
  }

  return (
    <TextPdf
      style={{
        ...borderStyle,
        ...style,
        color: color,
        minWidth: minWidth,
        maxWidth: maxWidth,
        fontSize: fontSize,
        textAlign: textAlign,
        padding: padding,
        fontFamily: bold ? 'Helvetica-Bold' : 'Helvetica',
      }}
    >
      {children && children !== 'null' ? children : '-'}
    </TextPdf>
  )
}

export default Text
