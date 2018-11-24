import React, { useState, useEffect, useRef } from 'react';

class ContentEditable extends React.Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
    this.el = null;
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  handleChange(e) {
    if (this.props.onChange !== undefined) {
      this.props.onChange(e);
    }
  }
  handleFocus(e) {
    if (this.props.onFocus !== undefined) this.props.onFocus(e);
  }
  handleBlur(e) {
    if (this.props.onBlur !== undefined) this.props.onBlur(e);
  }

  componentDidMount() {
    this.el = this.props.innerRef.current;
    this.el.addEventListener('input', this.handleChange);
    this.el.addEventListener('focus', this.handleFocus);
    this.el.addEventListener('blur', this.handleBlur);
    this.el.innerHTML = this.props.html;
  }

  componentDidUpdate(prevProps) {
    if (this.el) {
      if (this.props.html && this.el.innerHTML != this.props.html)
        this.el.innerHTML = this.props.html;
    }
  }

  componentWillUnmount() {
    this.el.removeEventListener('input', this.handleChange);
    this.el.removeEventListener('focus', this.handleFocus);
    this.el.removeEventListener('blur', this.handleBlur);
  }

  render() {
    const { style } = this.props;
    const CustomTag = `${this.props.tagName}`;
    return (
      <CustomTag
        ref={this.props.innerRef}
        style={style}
        contentEditable={true}
      />
    );
  }
}

export default React.forwardRef((props, ref) => (
  <ContentEditable innerRef={ref} {...props} />
));
