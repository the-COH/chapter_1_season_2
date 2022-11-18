import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {IProject, Projects} from "../data/Projects";
import DuneIframe from "../components/DuneIframe";
import Layout from "../Layout";

export default function Project(): JSX.Element {
    const { projectId } = useParams();

    const [project, setProject] = useState<IProject | null>(null);

    useEffect(() => {
        setProject(projectId && Projects[projectId] !== undefined ? Projects[projectId] : null);
    }, [projectId]);

    return (
        <Layout width={"wide"}>
            <>
                {project ? (
                    <>
                        <header className="hero pt-0 pb-4">
                            {project.logo ? (
                                <img
                                    src={"/assets/projects/"+project.logo}
                                    alt={project.name}
                                    style={{
                                        height: "100px"
                                    }}
                                />
                            ) : (
                                <span style={{
                                    display: "inline-block",
                                    width: "100px",
                                    height: "100px",
                                    backgroundColor: "#333",
                                }}/>
                            )}
                            <h1 className={"mt-3 mb-0"}>
                                {project.name}
                            </h1>
                            <p className="ms-3 lead mt-3">
                                {project.description}
                            </p>
                            <div className="socials mb-3">
                                <ul className="list-inline m-0">
                                    {project?.socials?.twitter && (
                                        <li className={"list-inline-item"}>
                                            <a href={project.socials.twitter} target={"_blank"} className={"small text-decoration-none"} rel="noreferrer">
                                                <i className="fab fa-twitter" /> Twitter
                                            </a>
                                        </li>
                                    )}
                                    {project?.socials?.discord && (
                                        <li className={"list-inline-item"}>
                                            <a href={project.socials.discord} target={"_blank"} className={"small text-decoration-none"} rel="noreferrer">
                                                <i className="fab fa-discord" /> Discord
                                            </a>
                                        </li>
                                    )}
                                    {project?.website && (
                                        <li className={"list-inline-item"}>
                                            <a href={project.website} target={"_blank"} className={"text-decoration-none small"} rel="noreferrer">
                                                <i className="fas fa-world" />{" "}
                                                {project.website.replace("https://", "")}
                                                <small>
                                                    <sup>
                                                        <span className="fa-solid fa-arrow-up-right-from-square ms-2" />
                                                    </sup>
                                                </small>
                                            </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </header>
                        <h2 className={"text-center text-white py-3"}>
                            Analytics
                        </h2>
                        <div className="row justify-content-center">
                            {(project.duneQueryEmbeds && project.duneQueryEmbeds.length) ? (
                                <>
                                    {project.duneQueryEmbeds.map((src: string, index: number) => (
                                        <div
                                            key={src+index.toString(10)}
                                            className="col-md-6"
                                        >
                                            <DuneIframe src={src} />
                                        </div>
                                    ))}
                                </>
                            ) : <p className={"lead text-muted text-center"}>No analytics found</p>}
                        </div>
                    </>
                ) : (
                    <>
                        <p className="lead text-center text-muted">
                            Not found
                        </p>
                    </>
                )}
            </>
        </Layout>
    );
}
