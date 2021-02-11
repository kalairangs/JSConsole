const Input = (props)=>{

    const showPrevData = (item, index) => (
        <div key={index} style={{ height: "45px", textAlign: "left" }}>
          <span style={{ color: "red" }}>{"> "}</span>
          {item}
        </div>
      );
    return (
        <div className="Input">
          <div>{props.prevData.length > 0 && props.prevData.map(showPrevData)}</div>
          <div className="textarea">
            <textarea
              ref={props.inputRef}
              value={props.inputValue}
              onChange={props.updateInputValue}
              onKeyDown={props.interpretJsCode}
              style={{ width: "100%", height: "100px" }}
              autoFocus
            />
          </div>
        </div>
      );
}

export default Input;