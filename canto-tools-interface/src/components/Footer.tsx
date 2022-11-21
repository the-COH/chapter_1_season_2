import React from "react";

export default function Footer(): JSX.Element {
    return (
        <>
            <footer className="text-center py-5 mt-5">
                <div className="container">
                    <p
                        className="small"
                        style={{
                            color: "#333"
                        }}
                    >
                        This website is a open source, community-driven repository of projects being built on the Canto blockchain.
                        <br />
                        The repository does not serve as any kind of source of financial advise or approval of legitimacy of any projects listed, and is entirely built for informational purposes.
                    </p>
                </div>
            </footer>
        </>
    );
}
