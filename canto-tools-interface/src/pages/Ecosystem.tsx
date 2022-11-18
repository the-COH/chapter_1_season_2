import React, {useEffect, useState} from "react";
import {IProject, Projects} from "../data/Projects";
import {Link} from "react-router-dom";
import Layout from "src/Layout";

const Categories = [
    ...new Set(
        Object.values(Projects)
            .map(project => project.category)
    )
];

export default function Ecosystem(): JSX.Element {
    const [categories, setCategories] = useState<string[]>([]);
    const [projects, setProjects] = useState<IProject[]>(Object.values(Projects));

    useEffect(() => {
        setProjects(
            Object.keys(Projects)
                .filter(projectKey => categories.length === 0 || categories.includes(Projects[projectKey].category))
                .map(projectKey => Projects[projectKey])
                .sort((a, b) => a.name.localeCompare(b.name))
        );
    }, [categories]);

    return (
        <Layout width={"wide"}>
            <>
                <header className="hero py-2 pb-4">
                    <h1 className={"m-0"}>
                        🌱 Ecosystem
                    </h1>
                    <p className="ms-3 text-muted lead mt-3">
                        {Object.values(Projects).length} projects
                    </p>
                </header>
                <div className="row">
                    <div className="col-md-3 col-lg-2">
                        <ul className="list-unstyled mb-5">
                            <li className={"mb-3"}>
                                <button
                                    type={"button"}
                                    onClick={() => setCategories([])}
                                    className="btn btn-dark w-100 text-start"
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <div>
                                            All
                                        </div>
                                        <div>
                                            {categories.length ? <span /> : <span key={"all_icon"}><i className={"fas fa-check"} /></span>}
                                        </div>
                                    </div>
                                </button>
                            </li>
                            {Categories
                                .map(categoryItem => (
                                    <li key={categoryItem} className={"mb-3"}>
                                        <button
                                            type={"button"}
                                            onClick={() => setCategories(
                                                categories.includes(categoryItem) ? [] : [categoryItem]
                                            )}
                                            className="btn btn-dark w-100 text-start"
                                        >
                                            <div className="d-flex w-100 justify-content-between">
                                                <div>
                                                    {categoryItem}
                                                    <span className="ms-3 text-muted">
                                                        {Object.values(Projects).filter(project => project.category === categoryItem).length}
                                                    </span>
                                                </div>
                                                <div>
                                                    {categories.includes(categoryItem) ? <span key={categoryItem+"_icon"}><i className={"fas fa-check"} /></span> : <span />}
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                ))}
                        </ul>
                    </div>
                    <div className="col-md-9 col-lg-10">
                        {projects.length ? (
                            <div className="projects">
                                <div className="card">
                                    <table className="table">
                                        <tbody>
                                            {projects
                                                .map(project => (
                                                    <tr
                                                        key={project.name}
                                                    >
                                                        <td>
                                                            <div className="d-flex w-100">
                                                                <div>
                                                                    <Link to={"/projects/"+project.id}>
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
                                                                    </Link>
                                                                </div>
                                                                <div className={"ps-3"}>
                                                                    <p className="h5 fw-bold m-0">
                                                                        <Link to={"/projects/"+project.id} className={"text-decoration-none text-white"}>
                                                                            {project.name}
                                                                        </Link>
                                                                    </p>
                                                                    <p className={"m-0"}>
                                                                        {project.category}
                                                                    </p>
                                                                    <p className={"small text-muted mb-1"}>
                                                                        {project.description || <>&nbsp;</>}
                                                                    </p>
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
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className={"lead"}>
                                No projects matched your criteria.
                            </p>
                        )}
                    </div>
                </div>
            </>
        </Layout>
    );
}
