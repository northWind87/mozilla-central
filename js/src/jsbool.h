/* -*- Mode: C; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 4 -*-
 *
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Communicator client code, released
 * March 31, 1998.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

#ifndef jsbool_h___
#define jsbool_h___
/*
 * JS boolean interface.
 */

#include "jsapi.h"

JS_BEGIN_EXTERN_C

/*
 * Pseudo-booleans, not visible to script but used internally by the engine.
 *
 * JSVAL_HOLE is a useful value for identifying a hole in an array.  It's also
 * used in the interpreter to represent "no exception pending".  In general it
 * can be used to represent "no value".
 *
 * A JSVAL_HOLE can be cheaply converted to undefined without affecting any
 * other boolean (or pseudo boolean) by masking out JSVAL_HOLE_MASK.
 *
 * JSVAL_ARETURN is used to throw asynchronous return for generator.close().
 *
 * NB: PSEUDO_BOOLEAN_TO_JSVAL(2) is JSVAL_VOID (see jsapi.h).
 */
#define JSVAL_HOLE_FLAG jsval(4 << JSVAL_TAGBITS)
#define JSVAL_HOLE      (JSVAL_VOID | JSVAL_HOLE_FLAG)
#define JSVAL_ARETURN   PSEUDO_BOOLEAN_TO_JSVAL(8)

static JS_ALWAYS_INLINE JSBool
JSVAL_TO_PUBLIC_PSEUDO_BOOLEAN(jsval v)
{
    JS_ASSERT(v == JSVAL_TRUE || v == JSVAL_FALSE || v == JSVAL_VOID);
    return JSVAL_TO_PSEUDO_BOOLEAN(v);
}

extern JSClass js_BooleanClass;

extern JSObject *
js_InitBooleanClass(JSContext *cx, JSObject *obj);

extern JSString *
js_BooleanToString(JSContext *cx, JSBool b);

extern JSBool
js_BooleanToStringBuffer(JSContext *cx, JSBool b, JSTempVector<jschar> &buf);

extern JSBool
js_ValueToBoolean(jsval v);

JS_END_EXTERN_C

#endif /* jsbool_h___ */
