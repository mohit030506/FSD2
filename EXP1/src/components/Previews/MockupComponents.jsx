import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Repeat, 
  Share, 
  Bookmark, 
  MoreHorizontal, 
  ThumbsUp, 
  Globe, 
  Send, 
  CheckCircle,
  ExternalLink,
  AtSign,
  Share2
} from 'lucide-react';

const USER_AVATAR = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
const USER_NAME = 'Alex Morgan';
const USER_HANDLE = '@alexmorgan_dev';

export function TwitterMockup({ text, media, pinTitle }) {
  return (
    <div className="tweet-card mockup-card">
      <div className="card-header">
        <img src={USER_AVATAR} alt={USER_NAME} className="avatar-img" />
        <div className="header-meta">
          <div className="name-row">
            <span className="user-name">{USER_NAME}</span>
            <CheckCircle size={14} color="#1DA1F2" fill="#1DA1F2" />
            <span className="user-handle">{USER_HANDLE}</span>
            <span className="dot">•</span>
            <span className="time-ago">Just now</span>
          </div>
        </div>
        <MoreHorizontal size={16} className="more-btn" />
      </div>

      <div className="tweet-content">
        <p className="post-text-body">{text || 'Compose your post to see Twitter preview...'}</p>
        
        {media.length > 0 && (
          <div className={`media-grid grid-count-${Math.min(media.length, 4)}`}>
            {media.slice(0, 4).map((m, idx) => (
              <div key={idx} className="grid-media-item">
                <img src={m.url} alt={m.altText || 'Tweet media'} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="tweet-footer">
        <div className="tweet-action"><MessageCircle size={16} /> 12</div>
        <div className="tweet-action action-retweet"><Repeat size={16} /> 48</div>
        <div className="tweet-action action-like"><Heart size={16} /> 342</div>
        <div className="tweet-action"><Bookmark size={16} /></div>
        <div className="tweet-action"><Share size={16} /></div>
      </div>
    </div>
  );
}

export function LinkedInMockup({ text, media }) {
  return (
    <div className="linkedin-card mockup-card">
      <div className="card-header">
        <img src={USER_AVATAR} alt={USER_NAME} className="avatar-img" />
        <div className="header-meta">
          <span className="user-name">{USER_NAME}</span>
          <span className="user-headline">Senior Product Engineer & Content Lead</span>
          <span className="time-row">Just now • <Globe size={11} /></span>
        </div>
        <MoreHorizontal size={16} className="more-btn" />
      </div>

      <div className="linkedin-content">
        <p className="post-text-body">{text || 'Compose your post to see LinkedIn preview...'}</p>
        
        {media.length > 0 && (
          <div className="linkedin-media-wrapper">
            <img src={media[0].url} alt="LinkedIn media" className="single-cover-img" />
          </div>
        )}
      </div>

      <div className="linkedin-stats">
        <span className="likes-count">👍❤️ 128 reactions</span>
        <span className="comments-count">34 comments • 12 reposts</span>
      </div>

      <div className="linkedin-actions">
        <button type="button" className="li-action-btn"><ThumbsUp size={16} /> Like</button>
        <button type="button" className="li-action-btn"><MessageCircle size={16} /> Comment</button>
        <button type="button" className="li-action-btn"><Repeat size={16} /> Repost</button>
        <button type="button" className="li-action-btn"><Send size={16} /> Send</button>
      </div>
    </div>
  );
}

export function InstagramMockup({ text, media, firstComment }) {
  return (
    <div className="instagram-card mockup-card">
      <div className="card-header">
        <div className="story-ring">
          <img src={USER_AVATAR} alt={USER_NAME} className="avatar-img" />
        </div>
        <div className="header-meta">
          <span className="user-name">{USER_HANDLE.replace('@', '')}</span>
          <span className="location-tag">Original Audio</span>
        </div>
        <MoreHorizontal size={16} className="more-btn" />
      </div>

      <div className="insta-media-viewport">
        {media.length > 0 ? (
          <img src={media[0].url} alt="Instagram feed media" className="insta-main-img" />
        ) : (
          <div className="insta-placeholder">
            <span>📷 Instagram requires an image/video asset</span>
          </div>
        )}
      </div>

      <div className="insta-footer">
        <div className="insta-actions-bar">
          <div className="left-actions">
            <Heart size={20} className="icon-heart" />
            <MessageCircle size={20} />
            <Send size={20} />
          </div>
          <Bookmark size={20} />
        </div>

        <div className="insta-likes-label">Liked by <b>tech_insider</b> and <b>842 others</b></div>

        <div className="insta-caption font-sans">
          <span className="caption-handle">{USER_HANDLE.replace('@', '')}</span>{' '}
          {text || 'Instagram post caption...'}
        </div>

        {firstComment && (
          <div className="insta-first-comment">
            <span className="comment-handle">{USER_HANDLE.replace('@', '')}</span>{' '}
            <span className="comment-text">{firstComment}</span>
          </div>
        )}

        <div className="insta-time font-mono">2 MINUTES AGO</div>
      </div>
    </div>
  );
}

export function FacebookMockup({ text, media }) {
  return (
    <div className="facebook-card mockup-card">
      <div className="card-header">
        <img src={USER_AVATAR} alt={USER_NAME} className="avatar-img" />
        <div className="header-meta">
          <span className="user-name">{USER_NAME}</span>
          <span className="time-row">Just now • <Globe size={11} /></span>
        </div>
        <MoreHorizontal size={16} className="more-btn" />
      </div>

      <div className="fb-content">
        <p className="post-text-body">{text || 'Compose your post to see Facebook preview...'}</p>
        
        {media.length > 0 && (
          <div className="fb-media-wrapper">
            <img src={media[0].url} alt="Facebook media" className="single-cover-img" />
          </div>
        )}
      </div>

      <div className="fb-actions font-sans">
        <button type="button" className="fb-btn"><ThumbsUp size={16} /> Like</button>
        <button type="button" className="fb-btn"><MessageCircle size={16} /> Comment</button>
        <button type="button" className="fb-btn"><Share2 size={16} /> Share</button>
      </div>
    </div>
  );
}

export function ThreadsMockup({ text, media }) {
  return (
    <div className="threads-card mockup-card">
      <div className="threads-row">
        <div className="threads-left">
          <img src={USER_AVATAR} alt={USER_NAME} className="avatar-img" />
          <div className="threads-line"></div>
        </div>
        <div className="threads-right">
          <div className="threads-header">
            <span className="user-name">{USER_HANDLE.replace('@', '')}</span>
            <span className="threads-time font-mono">1m</span>
          </div>
          <p className="post-text-body">{text || 'Compose text to view Threads preview...'}</p>
          
          {media.length > 0 && (
            <div className="threads-media">
              <img src={media[0].url} alt="Threads media" />
            </div>
          )}

          <div className="threads-footer-actions">
            <Heart size={18} />
            <MessageCircle size={18} />
            <Repeat size={18} />
            <Send size={18} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PinterestMockup({ text, media, pinTitle, destinationUrl }) {
  return (
    <div className="pinterest-card mockup-card">
      <div className="pin-visual-wrapper">
        {media.length > 0 ? (
          <img src={media[0].url} alt={pinTitle || 'Pin visual'} className="pin-image" />
        ) : (
          <div className="pin-placeholder">
            <span>📌 Pinterest requires a Pin image</span>
          </div>
        )}
        <button type="button" className="pin-save-btn">Save</button>
      </div>

      <div className="pin-details font-sans">
        <h3 className="pin-title">{pinTitle || 'Pin Title Required'}</h3>
        <p className="pin-desc">{text || 'Pin description text...'}</p>
        
        {destinationUrl && (
          <a href={destinationUrl} target="_blank" rel="noreferrer" className="pin-link">
            <ExternalLink size={12} /> {destinationUrl}
          </a>
        )}

        <div className="pin-user">
          <img src={USER_AVATAR} alt={USER_NAME} className="avatar-img-sm" />
          <span className="pin-author">{USER_NAME}</span>
        </div>
      </div>
    </div>
  );
}
