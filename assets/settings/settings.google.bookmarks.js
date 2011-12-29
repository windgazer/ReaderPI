/**
 * In this file I'm attempting to create an easy to use JS API against the Google Bookmarks service. My intention is to use this API in order to
 * store the last-read comics for my HTML5 ComicReader application.
 * <p>I've used some initial hints from other authors, but eventually just reverse-engineered the API as it is used by the Google Bookmarks web interface.
 * Here are the HAR output results of the calls that I will attempt to implement in my lightweight JS-API:</p>
 * <dl>
 * <dt>List Labels:</dt>
 * <dd>{"pageref":"https://www.google.com/bookmarks/l#!view=bookmarks&op=mglabels","startedDateTime":"2011-10-12T20:29:47.445Z","time":760,"request":{"method":"GET","url":"https://www.google.com/bookmarks/api/bookmark?xt=Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655&op=LIST_LABELS","headers":[{"name":"User-Agent","value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/534.50.2 (KHTML, like Gecko) Version/5.0.6 Safari/533.22.3"},{"name":"Referer","value":"https://www.google.com/bookmarks/l"}],"queryString":[{"name":"xt","value":"Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655"},{"name":"op","value":"LIST_LABELS"}],"cookies":[],"headersSize":-1,"bodySize":-1},"response":{"status":200,"statusText":"OK","headers":[{"name":"Date","value":"Wed, 12 Oct 2011 20:29:49 GMT"},{"name":"Content-Encoding","value":"gzip"},{"name":"X-Content-Type-Options","value":"nosniff"},{"name":"Content-Length","value":"158"},{"name":"X-Xss-Protection","value":"1; mode=block"},{"name":"Pragma","value":"no-cache"},{"name":"Server","value":"GSE"},{"name":"X-Frame-Options","value":"SAMEORIGIN"},{"name":"Content-Type","value":"application/json; charset=UTF-8"},{"name":"Cache-Control","value":"no-cache, no-store, max-age=0, must-revalidate"},{"name":"Expires","value":"Fri, 01 Jan 1990 00:00:00 GMT"}],"cookies":[],"content":{"size":186,"mimeType":"application/json"},"redirectURL":"","headersSize":-1,"bodySize":186},"cache":{},"timings":{"blocked":0,"dns":-1,"connect":-1,"send":-1,"wait":-1,"receive":15,"ssl":-1}}
 * 
 * <dt>Rename Labels:</dt>
 * <dd>{"pageref":"https://www.google.com/bookmarks/l#!view=bookmarks&op=mglabels","startedDateTime":"2011-10-12T20:30:49.839Z","time":553,"request":{"method":"POST","url":"https://www.google.com/bookmarks/api/bookmark?xt=Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655&op=RENAME_LABELS&label=B4F&newLabel=Brands4Friends","headers":[{"name":"Origin","value":"https://www.google.com"},{"name":"User-Agent","value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/534.50.2 (KHTML, like Gecko) Version/5.0.6 Safari/533.22.3"},{"name":"Content-Type","value":"application/x-www-form-urlencoded;charset=UTF-8"},{"name":"Referer","value":"https://www.google.com/bookmarks/l"}],"queryString":[{"name":"xt","value":"Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655"},{"name":"op","value":"RENAME_LABELS"},{"name":"label","value":"B4F"},{"name":"newLabel","value":"Brands4Friends"}],"cookies":[],"headersSize":-1,"bodySize":-1},"response":{"status":200,"statusText":"OK","headers":[{"name":"Date","value":"Wed, 12 Oct 2011 20:30:51 GMT"},{"name":"Content-Encoding","value":"gzip"},{"name":"X-Content-Type-Options","value":"nosniff"},{"name":"P3p","value":"CP=\"This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657 for more info.\""},{"name":"Content-Length","value":"73"},{"name":"X-Xss-Protection","value":"1; mode=block"},{"name":"Pragma","value":"no-cache"},{"name":"Server","value":"GSE"},{"name":"X-Frame-Options","value":"SAMEORIGIN"},{"name":"Content-Type","value":"application/json; charset=UTF-8"},{"name":"Cache-Control","value":"no-cache, no-store, max-age=0, must-revalidate"},{"name":"Set-Cookie","value":"SID=DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA;Domain=.google.com;Path=/;Expires=Sat, 09-Oct-2021 20:30:51 GMT"},{"name":"Expires","value":"Fri, 01 Jan 1990 00:00:00 GMT"}],"cookies":[{"name":"SID","value":"DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA","path":"/","domain":".google.com","expires":"2021-10-09T20:30:51.000Z","httpOnly":false,"secure":false}],"content":{"size":62,"mimeType":"application/json"},"redirectURL":"","headersSize":-1,"bodySize":62},"cache":{},"timings":{"blocked":0,"dns":-1,"connect":-1,"send":-1,"wait":-1,"receive":164,"ssl":-1}}
 * </dd>
 * <dt>Create Bookmark:</dt>
 * <dd>{"pageref":"https://www.google.com/bookmarks/l#!view=bookmarks&op=add","startedDateTime":"2011-10-12T20:36:10.115Z","time":1216,"request":{"method":"POST","url":"https://www.google.com/bookmarks/api/thread?xt=Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655&op=Star","headers":[{"name":"Origin","value":"https://www.google.com"},{"name":"User-Agent","value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/534.50.2 (KHTML, like Gecko) Version/5.0.6 Safari/533.22.3"},{"name":"Content-Type","value":"application/x-www-form-urlencoded;charset=UTF-8"},{"name":"Referer","value":"https://www.google.com/bookmarks/l"}],"queryString":[{"name":"xt","value":"Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655"},{"name":"op","value":"Star"}],"cookies":[],"headersSize":-1,"bodySize":-1,"postData":{"mimeType":"application/x-www-form-urlencoded;charset=UTF-8","text":"td=%7B%22results%22%3A%5B%7B%22threadId%22%3A%22BDQAAAAAQAA%22%2C%22elementId%22%3A0%2C%22authorId%22%3A0%2C%22title%22%3A%22PageName%22%2C%22timestamp%22%3A0%2C%22formattedTimestamp%22%3A0%2C%22url%22%3A%22http%3A%2F%2Fmy.url%22%2C%22signedUrl%22%3A%22%22%2C%22previewUrl%22%3A%22%22%2C%22snippet%22%3A%22Description%20of%20my%20url.%22%2C%22threadComments%22%3A%5B%5D%2C%22parentId%22%3A%22BDQAAAAAQAA%22%2C%22labels%22%3A%5B%22Label1%22%2C%22Label2%22%5D%7D%5D%7D","params":[{"name":"td","value":"%7B%22results%22%3A%5B%7B%22threadId%22%3A%22BDQAAAAAQAA%22%2C%22elementId%22%3A0%2C%22authorId%22%3A0%2C%22title%22%3A%22PageName%22%2C%22timestamp%22%3A0%2C%22formattedTimestamp%22%3A0%2C%22url%22%3A%22http%3A%2F%2Fmy.url%22%2C%22signedUrl%22%3A%22%22%2C%22previewUrl%22%3A%22%22%2C%22snippet%22%3A%22Description%20of%20my%20url.%22%2C%22threadComments%22%3A%5B%5D%2C%22parentId%22%3A%22BDQAAAAAQAA%22%2C%22labels%22%3A%5B%22Label1%22%2C%22Label2%22%5D%7D%5D%7D"}]}},"response":{"status":200,"statusText":"OK","headers":[{"name":"Date","value":"Wed, 12 Oct 2011 20:36:12 GMT"},{"name":"Content-Encoding","value":"gzip"},{"name":"X-Content-Type-Options","value":"nosniff"},{"name":"P3p","value":"CP=\"This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657 for more info.\""},{"name":"Content-Length","value":"695"},{"name":"X-Xss-Protection","value":"1; mode=block"},{"name":"Pragma","value":"no-cache"},{"name":"Server","value":"GSE"},{"name":"X-Frame-Options","value":"SAMEORIGIN"},{"name":"Content-Type","value":"application/json; charset=UTF-8"},{"name":"Cache-Control","value":"no-cache, no-store, max-age=0, must-revalidate"},{"name":"Set-Cookie","value":"SID=DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA;Domain=.google.com;Path=/;Expires=Sat, 09-Oct-2021 20:36:12 GMT"},{"name":"Expires","value":"Fri, 01 Jan 1990 00:00:00 GMT"}],"cookies":[{"name":"SID","value":"DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA","path":"/","domain":".google.com","expires":"2021-10-09T20:36:12.000Z","httpOnly":false,"secure":false}],"content":{"size":1565,"mimeType":"application/json"},"redirectURL":"","headersSize":-1,"bodySize":1565},"cache":{},"timings":{"blocked":0,"dns":-1,"connect":-1,"send":-1,"wait":-1,"receive":214,"ssl":-1}}
 * </dd>
 * <dt>Edit Bookmark:</dt>
 * <dd>{"pageref":"https://www.google.com/bookmarks/l#!view=threadsmgmt&fo=Starred&q=label:%22Label1%22","startedDateTime":"2011-10-12T20:51:46.726Z","time":764,"request":{"method":"POST","url":"https://www.google.com/bookmarks/api/thread?xt=Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655&op=UpdateThreadElement","headers":[{"name":"Origin","value":"https://www.google.com"},{"name":"User-Agent","value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/534.50.2 (KHTML, like Gecko) Version/5.0.6 Safari/533.22.3"},{"name":"Content-Type","value":"application/x-www-form-urlencoded;charset=UTF-8"},{"name":"Referer","value":"https://www.google.com/bookmarks/l"}],"queryString":[{"name":"xt","value":"Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655"},{"name":"op","value":"UpdateThreadElement"}],"cookies":[],"headersSize":-1,"bodySize":-1,"postData":{"mimeType":"application/x-www-form-urlencoded;charset=UTF-8","text":"td=%7B%22threads%22%3A%5B%5D%2C%22threadQueries%22%3A%5B%5D%2C%22threadResults%22%3A%5B%7B%22threadId%22%3A%22BDQAAAAAQAA%22%2C%22elementId%22%3A%22NDQAAAAAQoPSqzP_jqwIgo7TWrevSo5SlAQ%22%2C%22authorId%22%3A0%2C%22title%22%3A%22PageNameEdit%22%2C%22timestamp%22%3A0%2C%22formattedTimestamp%22%3A0%2C%22url%22%3A%22http%3A%2F%2Fmy.url%2F%22%2C%22signedUrl%22%3A%22%22%2C%22previewUrl%22%3A%22%22%2C%22snippet%22%3A%22Description%20of%20my%20url.%20Edited%20to%20boot.%22%2C%22threadComments%22%3A%5B%5D%2C%22parentId%22%3A%22%22%2C%22labels%22%3A%5B%22Label1%22%2C%22Label2%22%2C%22Label3%22%5D%7D%5D%2C%22threadComments%22%3A%5B%5D%7D","params":[{"name":"td","value":"%7B%22threads%22%3A%5B%5D%2C%22threadQueries%22%3A%5B%5D%2C%22threadResults%22%3A%5B%7B%22threadId%22%3A%22BDQAAAAAQAA%22%2C%22elementId%22%3A%22NDQAAAAAQoPSqzP_jqwIgo7TWrevSo5SlAQ%22%2C%22authorId%22%3A0%2C%22title%22%3A%22PageNameEdit%22%2C%22timestamp%22%3A0%2C%22formattedTimestamp%22%3A0%2C%22url%22%3A%22http%3A%2F%2Fmy.url%2F%22%2C%22signedUrl%22%3A%22%22%2C%22previewUrl%22%3A%22%22%2C%22snippet%22%3A%22Description%20of%20my%20url.%20Edited%20to%20boot.%22%2C%22threadComments%22%3A%5B%5D%2C%22parentId%22%3A%22%22%2C%22labels%22%3A%5B%22Label1%22%2C%22Label2%22%2C%22Label3%22%5D%7D%5D%2C%22threadComments%22%3A%5B%5D%7D"}]}},"response":{"status":200,"statusText":"OK","headers":[{"name":"Date","value":"Wed, 12 Oct 2011 20:51:48 GMT"},{"name":"Content-Encoding","value":"gzip"},{"name":"X-Content-Type-Options","value":"nosniff"},{"name":"P3p","value":"CP=\"This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657 for more info.\""},{"name":"Content-Length","value":"696"},{"name":"X-Xss-Protection","value":"1; mode=block"},{"name":"Pragma","value":"no-cache"},{"name":"Server","value":"GSE"},{"name":"X-Frame-Options","value":"SAMEORIGIN"},{"name":"Content-Type","value":"application/json; charset=UTF-8"},{"name":"Cache-Control","value":"no-cache, no-store, max-age=0, must-revalidate"},{"name":"Set-Cookie","value":"SID=DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA;Domain=.google.com;Path=/;Expires=Sat, 09-Oct-2021 20:51:48 GMT"},{"name":"Expires","value":"Fri, 01 Jan 1990 00:00:00 GMT"}],"cookies":[{"name":"SID","value":"DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA","path":"/","domain":".google.com","expires":"2021-10-09T20:51:48.000Z","httpOnly":false,"secure":false}],"content":{"size":1518,"mimeType":"application/json"},"redirectURL":"","headersSize":-1,"bodySize":1518},"cache":{},"timings":{"blocked":0,"dns":-1,"connect":-1,"send":-1,"wait":-1,"receive":4,"ssl":-1}}
 * </dd>
 * <dt>Delete Bookmark:</dt>
 * <dd>{"pageref":"https://www.google.com/bookmarks/l#!view=threadsmgmt&fo=Starred&q=label:%22Label1%22","startedDateTime":"2011-10-12T21:00:43.366Z","time":734,"request":{"method":"POST","url":"https://www.google.com/bookmarks/api/thread?xt=Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655&op=DeleteItems","headers":[{"name":"Origin","value":"https://www.google.com"},{"name":"User-Agent","value":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_5_8) AppleWebKit/534.50.2 (KHTML, like Gecko) Version/5.0.6 Safari/533.22.3"},{"name":"Content-Type","value":"application/x-www-form-urlencoded;charset=UTF-8"},{"name":"Referer","value":"https://www.google.com/bookmarks/l"}],"queryString":[{"name":"xt","value":"Snsna7oU-v6kCvsei7L7mJ1mBGc%3A1318372848655"},{"name":"op","value":"DeleteItems"}],"cookies":[],"headersSize":-1,"bodySize":-1,"postData":{"mimeType":"application/x-www-form-urlencoded;charset=UTF-8","text":"td=%7B%22deleteAllBookmarks%22%3Afalse%2C%22deleteAllThreads%22%3Afalse%2C%22urls%22%3A%5B%5D%2C%22ids%22%3A%5B%22NDQAAAAAQoPSqzP_jqwIgo7TWrevSo5SlAQ%22%5D%7D","params":[{"name":"td","value":"%7B%22deleteAllBookmarks%22%3Afalse%2C%22deleteAllThreads%22%3Afalse%2C%22urls%22%3A%5B%5D%2C%22ids%22%3A%5B%22NDQAAAAAQoPSqzP_jqwIgo7TWrevSo5SlAQ%22%5D%7D"}]}},"response":{"status":200,"statusText":"OK","headers":[{"name":"Date","value":"Wed, 12 Oct 2011 21:00:45 GMT"},{"name":"Content-Encoding","value":"gzip"},{"name":"X-Content-Type-Options","value":"nosniff"},{"name":"P3p","value":"CP=\"This is not a P3P policy! See http://www.google.com/support/accounts/bin/answer.py?hl=en&answer=151657 for more info.\""},{"name":"Content-Length","value":"116"},{"name":"X-Xss-Protection","value":"1; mode=block"},{"name":"Pragma","value":"no-cache"},{"name":"Server","value":"GSE"},{"name":"X-Frame-Options","value":"SAMEORIGIN"},{"name":"Content-Type","value":"application/json; charset=UTF-8"},{"name":"Cache-Control","value":"no-cache, no-store, max-age=0, must-revalidate"},{"name":"Set-Cookie","value":"SID=DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA;Domain=.google.com;Path=/;Expires=Sat, 09-Oct-2021 21:00:45 GMT"},{"name":"Expires","value":"Fri, 01 Jan 1990 00:00:00 GMT"}],"cookies":[{"name":"SID","value":"DQAAANMAAAB8CytmLpPnCQYjWiv30Mpnx6fvkC1yr_7VDvMNXMYjuYszwlGeVO6xctbrhNHd-ZeCWTCU-uWtDzyw_s5VE_ylj9p9zdXSAnYtScBDhc9DoKH5fezzRv_5HQ7uAfVwTf-nPgOa48vo4Px8L58l2apkmu3rVljCwhnI0UJB_fHGFxFbz5k7drpJKqAnoOzSo9GxAqWtSNtq0EpS7uHHfckh_5Kpl_UQmSHpXtD1qHTCCHsH6DPmvj-e1PiZwHca1LhE9q_fgtTtpe8rtkhMzZEcLX7qRGVLT47GCqS4JNXXBA","path":"/","domain":".google.com","expires":"2021-10-09T21:00:45.000Z","httpOnly":false,"secure":false}],"content":{"size":126,"mimeType":"application/json"},"redirectURL":"","headersSize":-1,"bodySize":126},"cache":{},"timings":{"blocked":0,"dns":-1,"connect":-1,"send":-1,"wait":-1,"receive":173,"ssl":-1}}
 * </dd>
 * </dl>
 * 
 * @fileoverview
 */

/**
 * This is a singleton type class for using the google bookmarks API. The reason that it's a singleton
 * is because you have to authenticate against the google bookmarks service in order to make use of the
 * service, as it stands that makes the API single-user and essentially single-threaded.
 * 
 * @class
 */
var GoogleBookmarksAPI = {
	
	xt : "XRI_Dzwc6B-RTSizEcQsaeweeSI:1318544510561",
	
	threadurl : "https://www.google.com/bookmarks/api/thread?xt=%1&op=%2",
	
	//TODO THREAD_CREATE A GETBOOKMARKS METHOD
	bookmarkurl : "https://www.google.com/bookmarks/api/bookmark?xt=%1&op=%2",

	URL : {
		thread : "",
		bookmark : "",
		authenticateStart : "https://accounts.google.com/ServiceLogin?",
		authenticatePost : "https://www.google.com/accounts/ServiceLoginAuth",
		authenticateFinish : "https://www.google.com/accounts/CheckCookie?continue=https%3A%2F%2Fwww.google.com%2Fbookmarks%2Fl&followup=https%3A%2F%2Fwww.google.com%2Fbookmarks%2Fl&service=bookmarks&chtml=LoginDoneHtml"
	},
	
	ops : {
		THREAD_CREATE : "Star",
		BM_LISTLABELS : "LIST_LABELS"
	},
	
	authenticate : function () {
		var result = null;
		AJAXHelper.getData( "http://www.google.com/bookmarks/lookup?q=label:label2&output=xml", function(json){result = json}, false );
		return result;
	},
	
	getLabels : function () {
		return this.getRequest( this.ops.BM_LISTLABELS );
	},

	create : function ( bookmark ) {
		return this.postRequest ( this.ops.THREAD_CREATE, "td=" + escape("{\"results\":[" + bookmark.toJSON() + "]}") );
	},
	
	postRequest : function ( op, content ) {
		var url = this.threadurl.replace( "%1", this.xt ).replace( "%2", op );
		var result = null;
		AJAXHelper.getData( url, function(json){result = json}, false, content );
		return result;
	},
	
	getRequest : function ( op ) {
		var url = this.bookmarkurl.replace( "%1", this.xt ).replace( "%2", op );
		var result = null;
		AJAXHelper.getData( url, function(json){result = json}, false );
		return result;
	}

};

/**
 * A JavaScript Class representing a google bookmark. Not nearly all of the available fields are
 * represented, that is to keep the use of the class simple, most of the available fields are
 * overkill for use in generic use-cases.
 * 
 * @class
 */
var GoogleBookmark = Class.extend({

	/**
	 * Construct a new GoogleBookmark, this class is considdered immutable so make sure you
	 * fill in all the required parameters ;)
	 * In the future I might provide setters for fields that can be edited, for instance the url
	 * field is immutable in the google bookmarks service, to alter it you'd have to destroy the
	 * existing entry and create a new one...
	 * As my immediate requirements do not nessecitate any editing of bookmarks (except for the url
	 * actually), the entire class is considdered immutable for now.
	 * 
	 * @constructor
	 * @argument {String} url The url for this bookmark (is immutable in google service)
	 * @argument {String} title The title of this bookmark.
	 * @argument {Array} labels An Array of labels, can also be a comma-separated list.
	 * @argument {String} description The desciption of this bookmark.
	 */
	init : function ( url, title, labels, description ) {

		this.url = url;
		this.title = title;
		this.labels = labels.length?labels:labels.split(/, ?/);
		this.description = description;

	},

	/**
	 * Returns the url for this bookmark
	 * @return {String} The url
	 */	
	getUrl : function () {
		return this.url;
	},
	
	/**
	 * Returns the title for this bookmark
	 * @return {String} The title
	 */	
	getTitle : function () {
		return this.title;
	},
	
	/**
	 * Returns the labels for this bookmark
	 * @return {Array} The labels
	 */	
	getLabels : function () {
		return this.labels;
	},
	
	/**
	 * Returns the description for this bookmark
	 * @return {String} The description
	 */	
	getDescription : function () {
		return this.description;
	},

	/**
	 * Returns a JSON serialized version of this Object.
	 * @override
	 */	
	toJSON : function () {
		
		//Currently this toString encode still expects this to be a new bookmark
		//which results in some values being 0 for instance...
		//TODO Figure out where to get the threadId and parentId from... :)
		return JSON.stringify( {
				"threadId":"BDQAAAAAQAA",
				"elementId":0,
				"authorId":0,
				"title":this.title,
				"timestamp":0,
				"formattedTimestamp":0,
				"url":this.url,
				"signedUrl":"",
				"previewUrl":"",
				"snippet":this.description,
				"threadComments":[],
				"parentId":"BDQAAAAAQAA",
				"labels":this.labels
		} );
		 
	}

});
