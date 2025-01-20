import { View as ViewPdf, StyleSheet } from '@react-pdf/renderer'

const View = (props: any) => {
  const {
    display = 'flex',
    flexDirection = 'row',
    border,
    borderContent,
    children,
    width,
    alignItems,
    justifyContent,
    padding,
    style,
  } = props

  const borderStyle = {
    borderTop: border?.top || borderContent ? '1px solid black' : '',
    borderRight: border?.right || borderContent ? '1px solid black' : '',
    borderBottom: border?.bottom || borderContent ? '1px solid black' : '',
    borderLeft: border?.left || borderContent ? '1px solid black' : '',
  }

  const styleView = {
    ...borderStyle,
    ...style,
    flexDirection: flexDirection,
    width: width,
    display: display,
    alignItems: alignItems,
    justifyContent: justifyContent,
    padding: padding,
  }

  return <ViewPdf style={styleView}>{children}</ViewPdf>
}

export default View
