import { useEffect, useRef, useState, type ReactElement } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BannerTop from "./components/BannerTop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CodeIcon from "@mui/icons-material/Code";
import EditIcon from "@mui/icons-material/Edit";
import BrushIcon from '@mui/icons-material/Brush';
import GroupsIcon from "@mui/icons-material/Groups";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import {
  getProject,
  isVideoMedia,
  type Media,
  type Project as ProjectRecord,
} from "../firebase/projects";
import "./Project.css";

const roleToneClasses = ["is-purple", "is-coral", "is-gold", "is-cyan"];

function isMedia(media: Media | null): media is Media {
  return media !== null;
}

function getRoleIcon(role: string): ReactElement {
  const normalizedRole = role.toLowerCase();

  if (
    normalizedRole.includes("program") ||
    normalizedRole.includes("code") ||
    normalizedRole.includes("developer") ||
    normalizedRole.includes("engineer")
  ) {
    return <CodeIcon fontSize="inherit" />;
  }

  if (
    normalizedRole.includes("game") ||
    normalizedRole.includes("designer") ||
    normalizedRole.includes("level")
  ) {
    return <SportsEsportsIcon fontSize="inherit" />;
  }

  if (
    normalizedRole.includes("artist")
  )
  {
    return <BrushIcon fontSize="inherit" />;
  }

  if (
    normalizedRole.includes("writer") ||
    normalizedRole.includes("narrative") ||
    normalizedRole.includes("story")
  ) {
    return <EditIcon fontSize="inherit" />;
  }

  return <GroupsIcon fontSize="inherit" />;
}

function getRoleTone(role: string, index: number): string {
  const normalizedRole = role.toLowerCase();

  if (
    normalizedRole.includes("program") ||
    normalizedRole.includes("code")
  ) {
    return "is-coral";
  }

  if (
    normalizedRole.includes("writer") ||
    normalizedRole.includes("story")
  ) {
    return "is-gold";
  }

  if (normalizedRole.includes("game")||
    normalizedRole.includes("designer") ||
    normalizedRole.includes("level") ) {
    return "is-cyan";
  }

   if (normalizedRole.includes("artist")) {
    return "is-purple";
  }

  return roleToneClasses[index % roleToneClasses.length];
}

function MediaPreview({
  media,
  alt,
  controls = false,
}: {
  media: Media;
  alt: string;
  controls?: boolean;
}) {
  if (isVideoMedia(media)) {
    return (
      <video
        src={media.url}
        controls={controls}
        muted={!controls}
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  return <img src={media.url} alt={alt} />;
}

function Header() {
  return <BannerTop isProjectView />;
}

function ProjectLayout({
  project,
  loading,
}: {
  project: ProjectRecord | null;
  loading: boolean;
}) {
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const activeThumbRef = useRef<HTMLButtonElement | null>(null);
  const title = project?.title ?? "Project title";

  const description =
    project?.description ??
    "Loading the project description, recruiting roles, and application details.";

  const roles = project?.roles ?? [];
  const coverImage = project?.coverImage ?? null;
  const media = [coverImage, ...(project?.otherMedia ?? [])].filter(isMedia);
  const activeMedia = media[activeMediaIndex] ?? media[0] ?? null;
  const canAdvanceMedia = media.length > 1;

  useEffect(() => {
    setActiveMediaIndex(0);
  }, [project?.id]);

  useEffect(() => {
    if (activeMediaIndex >= media.length) {
      setActiveMediaIndex(0);
    }
  }, [activeMediaIndex, media.length]);

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeMediaIndex, media.length]);

  const handlePreviousMedia = () => {
    if (!canAdvanceMedia) return;

    setActiveMediaIndex((currentIndex) =>
      currentIndex === 0 ? media.length - 1 : currentIndex - 1,
    );
  };

  const handleNextMedia = () => {
    if (!canAdvanceMedia) return;

    setActiveMediaIndex((currentIndex) => (currentIndex + 1) % media.length);
  };

  return (
    <main
      className={`project-shell project-detail-panel${
        loading ? " project-loading" : ""
      }`}
    >
      <section
        className="project-media-column"
        aria-label="Project media"
      >
        <div className="project-media-card">
          <div className="project-preview-frame">
            {activeMedia ? (
              <MediaPreview
                media={activeMedia}
                alt={`${title} preview ${activeMediaIndex + 1}`}
                controls
              />
            ) : (
              <div
                className="project-preview-placeholder"
                aria-hidden="true"
              />
            )}
          </div>

          <div className="project-media-summary">
            <h2 className="project-title">{title}</h2>

            <a
              className="project-signup"
              href="#project-apply"
            >
              <span className="project-signup-icon">
                <PlayArrowIcon fontSize="inherit" />
              </span>
              Sign up
            </a>
          </div>
        </div>

        <div
          className="project-carousel"
          aria-label="Project previews"
        >
          <button
            className="project-carousel-arrow"
            type="button"
            aria-label="Previous preview"
            title="Previous preview"
            onClick={handlePreviousMedia}
            disabled={!canAdvanceMedia}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </button>
          <div className="project-thumb-track">
            {media.length > 0 ? (
              media.map((item, mediaIndex) => (
                <button
                  className={`project-thumb-button${
                    mediaIndex === activeMediaIndex ? " is-active" : ""
                  }`}
                  type="button"
                  aria-label={`Preview ${mediaIndex + 1}`}
                  aria-current={mediaIndex === activeMediaIndex}
                  key={`${item.path}-${mediaIndex}`}
                  ref={mediaIndex === activeMediaIndex ? activeThumbRef : null}
                  onClick={() => setActiveMediaIndex(mediaIndex)}
                >
                  <MediaPreview media={item} alt="" />
                  {isVideoMedia(item) ? (
                    <span className="project-thumb-play" aria-hidden="true">
                      <PlayArrowIcon fontSize="small" />
                    </span>
                  ) : null}
                </button>
              ))
            ) : (
              <button className="project-thumb-button is-active" type="button" aria-label="Preview 1">
                <span className="project-thumb-play">
                  <PlayArrowIcon fontSize="small" />
                </span>
              </button>
            )}
          </div>
          <button
            className="project-carousel-arrow"
            type="button"
            aria-label="Next preview"
            title="Next preview"
            onClick={handleNextMedia}
            disabled={!canAdvanceMedia}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </button>
        </div>
      </section>

      <section
        className="project-copy-column"
        aria-label="Project details"
      >
        <div className="project-copy-section">
          <h2 className="project-section-title">
            Description
          </h2>

          <p className="project-body">
            {description}
          </p>
        </div>

        <div className="project-copy-section">
          <h2 className="project-section-title">
            Recruiting
          </h2>

          {roles.length > 0 ? (
            <div
              className="project-role-list"
              aria-label="Recruiting roles"
            >
              {roles.map((role, index) => (
                <span
                  className={`project-role-chip ${getRoleTone(
                    role,
                    index
                  )}`}
                  key={`${role}-${index}`}
                >
                  {getRoleIcon(role)}
                  {role}
                </span>
              ))}
            </div>
          ) : (
            <p className="project-role-empty">
              Recruiting roles will appear here.
            </p>
          )}
        </div>

        <div
          className="project-copy-section"
          id="project-apply"
        >
          <h2 className="project-section-title">
            Info on applying
          </h2>

          <p className="project-body">
            Tell the project team which role you are interested
            in, what you would like to contribute, and any
            portfolio or class project links that help show your
            work.
          </p>
        </div>
      </section>
    </main>
  );
}

function ProjectStatus({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack: () => void;
}) {
  return (
    <main className="project-status-panel">
      <h2>{title}</h2>

      <p>{message}</p>

      <button
        className="project-back-button"
        type="button"
        onClick={onBack}
      >
        <ArrowBackIcon fontSize="inherit" />
        Back to projects
      </button>
    </main>
  );
}

export default function Project() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  const navigate = useNavigate();

  const [project, setProject] =
    useState<ProjectRecord | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleBack = () => {
    navigate("/");
  };

  useEffect(() => {
    let isActive = true;

    async function loadProject() {
      if (!projectId) {
        setError("Missing project id.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setProject(null);

      try {
        const projectData = await getProject(projectId);
        //console.log("Fetched project:", projectData);

        if (isActive) {
          setProject(projectData);
        }
      } catch (err) {
        console.error("Error loading project:", err);

        if (isActive) {
          setError(
            "We could not load this project right now."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      isActive = false;
    };
  }, [projectId]);

  return (
    <div className="project-detail-page">
      <Header />

      {error ? (
        <ProjectStatus
          title="Project unavailable"
          message={error}
          onBack={handleBack}
        />
      ) : !loading && !project ? (
        <ProjectStatus
          title="Project not found"
          message="This project could not be found in the project list."
          onBack={handleBack}
        />
      ) : (
        <ProjectLayout
          project={project}
          loading={loading}
        />
      )}
    </div>
  );
}