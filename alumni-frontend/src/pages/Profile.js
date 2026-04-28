import { useEffect, useMemo, useState } from "react";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "";

const USERS_URL = `${API_BASE_URL}/api/users`;
const MAJORS_URL = `${API_BASE_URL}/api/majors`;

const CURRENT_USER_EMAIL_KEY = "alumni.currentUserEmail";
const DEFAULT_USER_EMAIL = "jilly.jam@example.com";


function Profile() {
  const [profile, setProfile] = useState(null);
  const [majors, setMajors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        setIsLoading(true);

        const storedEmail = String(
          window.localStorage.getItem(CURRENT_USER_EMAIL_KEY) ?? ""
        )
          .trim()
          .toLowerCase();

        const emailToLookup = storedEmail || DEFAULT_USER_EMAIL;

        const [usersRes, majorsRes] = await Promise.all([
          fetch(USERS_URL, { signal: controller.signal }),
          fetch(MAJORS_URL, { signal: controller.signal })
        ]);

        const [usersJson, majorsJson] = await Promise.all([
          usersRes.json().catch(() => []),
          majorsRes.json().catch(() => [])
        ]);

        const users = Array.isArray(usersJson) ? usersJson : [];
        const majorsArr = Array.isArray(majorsJson) ? majorsJson : [];

        const myUser = users.find(
          u => String(u?.email ?? "").trim().toLowerCase() === emailToLookup
        );

        // If the email doesn't match any record, fall back to the first user so
        // Profile still shows real DB-backed data.
        setProfile(myUser || users[0] || null);
        setMajors(majorsArr);
      } catch {
        setProfile(null);
        setMajors([]);
      } finally {
        setIsLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, []);

  const majorDetails = useMemo(() => {
    if (!profile?.major || majors.length === 0) return null;

    const majorId = profile.major?._id ?? profile.major;
    const byId = majors.find(m => String(m?._id ?? "") === String(majorId));
    if (byId) return byId;

    const majorName = profile.major?.name ?? profile.major;
    const wantedName = String(majorName).trim().toLowerCase();
    return majors.find(m => String(m?.name ?? "").trim().toLowerCase() === wantedName) || null;
  }, [profile, majors]);

  return (
    <section className="content-card">
      <div className="d-flex align-items-baseline justify-content-between flex-wrap gap-2">
        <h2 className="mb-0">Profile</h2>
        {isLoading ? <span className="text-muted">Loading…</span> : null}
      </div>

      {!isLoading && !profile ? (
        <div className="mt-3 alert alert-warning mb-0" role="alert">
          No profile found. Enter your email in Login, then refresh Profile.
        </div>
      ) : null}

      <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-3">
        <img
          src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
          alt="profile"
          style={{
            width: 160,
            height: 160,
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.08)",
            objectFit: "cover"
          }}
        />

        <div className="flex-grow-1 w-100">
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">
              {(profile?.first_name || "").trim()} {(profile?.last_name || "").trim()}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Username</span>
            <span className="detail-value">@{profile?.username}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{profile?.email}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Graduation Year</span>
            <span className="detail-value">{profile?.year_graduated}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Major</span>
            <span className="detail-value">{profile?.major?.name || profile?.major}</span>
          </div>

          {majorDetails?.description ? (
            <div className="detail-row">
              <span className="detail-label">Major Info</span>
              <span className="detail-value">{majorDetails.description}</span>
            </div>
          ) : null}

          <div className="detail-row">
            <span className="detail-label">Company</span>
            <span className="detail-value">{profile?.company}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Title</span>
            <span className="detail-value">{profile?.title}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">LinkedIn</span>
            <span className="detail-value">
              <a href={profile?.linkedin_link} target="_blank" rel="noreferrer">
                {profile?.linkedin_link}
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Profile;
