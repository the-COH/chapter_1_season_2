import React from "react";

export default function DuneIframe(props: { src: string, height?: number }): JSX.Element {
    const { src, height } = props;

    return <iframe
        src={src}
        frameBorder="0"
        className={"dune-iframe"}
        style={{
            width: "100%",
            height: (height || "250")+"px"
        }}
    />;
}
